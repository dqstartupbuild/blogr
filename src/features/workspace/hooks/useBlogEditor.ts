"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@/local/client/hooks";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { castBlogId } from "@/local/client/castBlogId";
import { castProductId } from "@/local/client/castProductId";
import { getBlogQuery } from "@/local/client/references/getBlogQuery";
import { updateBlogContentMutation } from "@/local/client/references/updateBlogContentMutation";
import { updateBlogImagesMutation } from "@/local/client/references/updateBlogImagesMutation";
import { demoBlogs } from "../constants/demoBlogs";
import { mapLocalBlog } from "../mappers/mapLocalBlog";
import type { BlogEditorState } from "../types/BlogEditorState";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

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
  const localBlogId = castBlogId(blogId);
  const localProductId = activeWorkspaceId
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
    isLive && localProductId
      ? { blogId: localBlogId, productId: localProductId }
      : "skip",
  );
  const updateBlogContent = useMutation(updateBlogContentMutation);
  const updateBlogImagesRecord = useMutation(updateBlogImagesMutation);
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
  const editBaseUpdatedAt = useRef<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorState = isDirty ? state : liveState;
  const blog = liveBlog ? mapLocalBlog(liveBlog) : fallbackBlog;

  const updateField = (field: keyof BlogEditorState, value: string) => {
    if (!isDirty) editBaseUpdatedAt.current = liveBlog?.updatedAt ?? null;
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

      if (!localProductId) {
        setMessage("Choose a workspace first.");
        return;
      }

      await updateBlogContent({
        blogId: localBlogId,
        excerpt: editorState.excerpt,
        mdx: editorState.mdx,
        productId: localProductId || undefined,
        seoTitle: editorState.seoTitle,
        title: editorState.title,
        expectedBlogUpdatedAt: editBaseUpdatedAt.current ?? liveBlog?.updatedAt,
      });

      setIsDirty(false);
      editBaseUpdatedAt.current = null;
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

    if (!localProductId) {
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

  const updateBlogImages: UpdateBlogImages = async (
    requestedBlogId,
    changes,
  ) => {
    if (!blog || blog.id !== requestedBlogId) {
      throw new Error("Blog not found.");
    }

    setMessage("Saving image changes...");

    if (!isLive) {
      setState((current) => ({
        ...(isDirty ? current : editorState),
        mdx: changes.mdx,
      }));
      setIsDirty(true);
      setMessage("Image changes saved in preview.");
      return;
    }

    if (!localProductId) {
      throw new Error("Choose a workspace first.");
    }

    try {
      const saved = await updateBlogImagesRecord({
        blogId: localBlogId,
        featureImageUrl: changes.featureImageUrl,
        images: changes.images,
        mdx: changes.mdx,
        productId: localProductId,
        expectedBlogUpdatedAt: isDirty ? editBaseUpdatedAt.current : blog.updatedAt,
      });
      if (isDirty) editBaseUpdatedAt.current = saved.updatedAt;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update that image.",
      );
      throw error;
    }

    if (isDirty) {
      setState((current) => ({ ...current, mdx: changes.mdx }));
    }

    setMessage("Image changes saved.");
  };

  return {
    isSaving,
    blog,
    message,
    regenerateImage,
    saveBlog,
    state: editorState,
    updateBlogImages,
    updateField,
  };
};
