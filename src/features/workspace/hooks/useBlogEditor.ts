"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { updateBlogContentMutation } from "@/server/convex/references/updateBlogContentMutation";
import { demoBlogs } from "../constants/demoBlogs";
import { demoProduct } from "../constants/demoProduct";
import { demoTopicDiscoveryResult } from "../constants/demoTopicDiscoveryResult";
import { emptyProduct } from "../constants/emptyProduct";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { appendRefreshPlanToMdx } from "../utils/appendRefreshPlanToMdx";
import { buildBlogRefreshSeedKeyword } from "../utils/buildBlogRefreshSeedKeyword";
import type { BlogEditorState } from "../types/BlogEditorState";
import type { TopicDiscoveryRequest } from "../types/topicDiscovery/TopicDiscoveryRequest";
import type { TopicDiscoveryResponse } from "../types/topicDiscovery/TopicDiscoveryResponse";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

type UseBlogEditorOptions = {
  activeWorkspaceId?: string;
  blogId: string;
  forceDemo: boolean;
};

export const useBlogEditor = ({
  activeWorkspaceId,
  blogId,
  forceDemo,
}: UseBlogEditorOptions) => {
  const isLive = !forceDemo && isLiveWorkspaceEnabled();
  const convexBlogId = castBlogId(blogId);
  const convexProductId = activeWorkspaceId
    ? castProductId(activeWorkspaceId)
    : null;
  const fallbackBlog = useMemo(
    () =>
      forceDemo
        ? demoBlogs.find((blog) => blog.id === blogId) || demoBlogs[0]
        : undefined,
    [blogId, forceDemo],
  );
  const liveBlog = useQuery(
    getBlogQuery,
    isLive && convexProductId
      ? { blogId: convexBlogId, productId: convexProductId }
      : "skip",
  );
  const productResult = useQuery(
    getCurrentProductQuery,
    isLive && convexProductId ? {} : "skip",
  );
  const createTopic = useMutation(createTopicMutation);
  const updateBlogContent = useMutation(updateBlogContentMutation);
  const liveState = useMemo(
    () => ({
      excerpt: liveBlog?.excerpt || fallbackBlog?.excerpt || "",
      mdx: liveBlog?.mdx || fallbackBlog?.mdx || "",
      seoTitle:
        liveBlog?.seoTitle ||
        liveBlog?.title ||
        fallbackBlog?.seoTitle ||
        fallbackBlog?.title ||
        "",
      title: liveBlog?.title || fallbackBlog?.title || "",
    }),
    [fallbackBlog, liveBlog],
  );
  const [state, setState] = useState<BlogEditorState>({
    excerpt: fallbackBlog?.excerpt || "",
    mdx: fallbackBlog?.mdx || "",
    seoTitle: fallbackBlog?.seoTitle || fallbackBlog?.title || "",
    title: fallbackBlog?.title || "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorState = isDirty ? state : liveState;
  const blog = liveBlog ? mapConvexBlog(liveBlog) : fallbackBlog;

  const updateField = (field: keyof BlogEditorState, value: string) => {
    setIsDirty(true);
    setState((current) => ({
      ...(isDirty ? current : editorState),
      [field]: value,
    }));
  };

  const saveBlog = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      if (!isLive) {
        setMessage("Saved in preview.");
        return;
      }

      if (!convexProductId) {
        setMessage("Choose a workspace first.");
        return;
      }

      await updateBlogContent({
        blogId: convexBlogId,
        excerpt: editorState.excerpt,
        mdx: editorState.mdx,
        productId: convexProductId || undefined,
        seoTitle: editorState.seoTitle,
        title: editorState.title,
      });

      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save yet.");
    } finally {
      setIsSaving(false);
    }
  };

  const discoverBlogRefreshIdeas = async (
    requestedBlogId: string,
    { includeAiAnswers, seedKeyword }: TopicDiscoveryRequest,
  ) => {
    if (!blog || blog.id !== requestedBlogId) {
      throw new Error("Blog not found.");
    }

    if (!isLive) {
      return demoTopicDiscoveryResult;
    }

    const discoveryProduct = productResult
      ? {
          audience: productResult.audience,
          competitors: productResult.competitors,
          description: productResult.description,
          name: productResult.name,
          niche: productResult.niche,
          rawContext: productResult.rawContext,
          siteLinks: productResult.siteLinks,
          websiteUrl: productResult.websiteUrl,
        }
      : {
          ...emptyProduct,
          ...demoProduct,
        };
    const searchKeyword =
      seedKeyword?.trim() || buildBlogRefreshSeedKeyword(blog);

    if (!searchKeyword) {
      throw new Error("Add a keyword or title before searching.");
    }

    const response = await fetch("/api/topics/discover", {
      body: JSON.stringify({
        existingBlogs: [
          {
            excerpt: blog.excerpt,
            keyword: blog.keyword,
            title: blog.title,
            updatedAt: blog.updatedAt,
          },
        ],
        existingTopics: [],
        includeAiAnswers,
        product: discoveryProduct,
        seedKeyword: searchKeyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as TopicDiscoveryResponse;

    if (!response.ok || !data.discovery) {
      throw new Error(data.error || "Could not find refresh ideas yet.");
    }

    return data.discovery;
  };

  const saveRefreshPlan = async (item: TopicDiscoveryPlanItem) => {
    if (!isLive) {
      setMessage("Saved in preview.");
      return;
    }

    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    await createTopic({
      keyword: item.title,
      notes: item.notes,
      productId: convexProductId,
    });

    setMessage("Plan saved.");
  };

  const applyRefreshPlan = (item: TopicDiscoveryPlanItem) => {
    const nextMdx = appendRefreshPlanToMdx(editorState.mdx, item);

    if (nextMdx === editorState.mdx) {
      setMessage("That plan is already in the draft.");
      throw new Error("That plan is already in the draft.");
    }

    updateField("mdx", nextMdx);
    setMessage("Plan added to draft.");
  };

  const regenerateImage = async (
    requestedBlogId: string,
    options: {
      alt?: string;
      imageIndex?: number;
      isFeatureImage?: boolean;
      prompt?: string;
      src?: string;
    },
  ) => {
    if (!blog || blog.id !== requestedBlogId) {
      throw new Error("Blog not found.");
    }

    if (!isLive) {
      setMessage("Image refreshed in preview.");
      return;
    }

    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    setMessage("Refreshing image...");

    const response = await fetch(`/api/blogs/${requestedBlogId}/regenerate-image`, {
      body: JSON.stringify({
        alt: options.alt,
        imageIndex: options.imageIndex,
        isFeatureImage: options.isFeatureImage,
        productId: activeWorkspaceId,
        prompt: options.prompt,
        src: options.src,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const data = (await response
        .json()
        .catch(() => ({}))) as { error?: string };
      const message = data.error || "Could not refresh that image.";
      setMessage(message);
      throw new Error(message);
    }

    setMessage("Image refreshed.");
  };

  return {
    applyRefreshPlan,
    discoverBlogRefreshIdeas,
    isSaving,
    blog,
    message,
    regenerateImage,
    saveBlog,
    saveRefreshPlan,
    state: editorState,
    updateField,
  };
};
