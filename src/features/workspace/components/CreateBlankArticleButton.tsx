"use client";
import { useState } from "react";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";
import type { TopicItem } from "../types/TopicItem";
import { SecondaryButton } from "./SecondaryButton";

export const CreateBlankArticleButton = ({ topic, onCreated }: { topic: TopicItem; onCreated: (blogId: string) => void }) => {
  const { state, mutate } = useLocalWorkspace();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const create = async () => {
    setBusy(true); setError("");
    try {
      const productId = state?.activeProductId;
      if (!productId) throw new Error("Choose a project first.");
      const title = topic.keyword.trim();
      const blogId = await mutate("upsertGeneratedBlogMutation", {
        productId, topicId: topic.id, keyword: title, title, seoTitle: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "article",
        excerpt: "", mdx: "", status: "draft", images: [], internalLinks: [], youtubeVideos: [], sources: [], tags: [],
      });
      onCreated(blogId);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create an article."); }
    finally { setBusy(false); }
  };
  return <><SecondaryButton disabled={busy} onClick={() => void create()} type="button">{busy ? "Creating..." : "Start blank article"}</SecondaryButton>{error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}</>;
};
