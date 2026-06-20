"use client";

import { useEffect, useMemo, useState } from "react";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { demoBlogs } from "../constants/demoBlogs";
import type { BlogEditorState } from "../types/BlogEditorState";

type UseBlogEditorOptions = {
  blogId: string;
  forceDemo: boolean;
};

export const useBlogEditor = ({ blogId, forceDemo }: UseBlogEditorOptions) => {
  const fallbackBlog = useMemo(
    () => demoBlogs.find((blog) => blog.id === blogId) || demoBlogs[0],
    [blogId],
  );
  const [state, setState] = useState<BlogEditorState>({
    excerpt: fallbackBlog?.excerpt || "",
    mdx: fallbackBlog?.mdx || "",
    title: fallbackBlog?.title || "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (forceDemo || !isLiveWorkspaceEnabled()) {
      return;
    }

    let isMounted = true;

    fetch(`/api/blogs/${blogId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Demo mode");
        return (await response.json()) as { blog?: BlogEditorState };
      })
      .then((data) => {
        if (!isMounted || !data.blog) return;
        setState({
          excerpt: data.blog.excerpt,
          mdx: data.blog.mdx,
          title: data.blog.title,
        });
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [blogId, forceDemo]);

  const updateField = (field: keyof BlogEditorState, value: string) => {
    setState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveBlog = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      if (forceDemo || !isLiveWorkspaceEnabled()) {
        setMessage("Saved in preview.");
        return;
      }

      const response = await fetch(`/api/blogs/${blogId}`, {
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || "Could not save yet.");
      }

      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save yet.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    message,
    saveBlog,
    state,
    updateField,
  };
};
