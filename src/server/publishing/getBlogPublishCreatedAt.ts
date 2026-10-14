import type { BlogItem } from "@/features/workspace/types/BlogItem";
import type { BlogPublishEventType } from "./types/BlogPublishEventType";

export const getBlogPublishCreatedAt = (
  blog: BlogItem,
  eventType: BlogPublishEventType,
  publishTimestamp: string,
) => {
  if (eventType !== "update_article") {
    return publishTimestamp;
  }

  const originalTimestamp =
    blog.publishedAt || blog.createdAt || blog.updatedAt;

  return new Date(originalTimestamp).toISOString();
};
