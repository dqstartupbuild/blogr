import type { BlogItem } from "@/features/workspace/types/BlogItem";
import type { BlogPublishEventType } from "./types/BlogPublishEventType";

export const getBlogPublishEventType = (
  blog: BlogItem,
): BlogPublishEventType => {
  return blog.status === "published" || blog.publishedAt
    ? "update_article"
    : "publish_articles";
};
