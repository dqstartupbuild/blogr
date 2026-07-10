"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { updateBlogContentMutation } from "@/server/convex/references/updateBlogContentMutation";
import { demoBlogs } from "../constants/demoBlogs";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import type { BlogEditorState } from "../types/BlogEditorState";

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
    isSaving,
    blog,
    message,
    regenerateImage,
    saveBlog,
    state: editorState,
    updateField,
  };
};
