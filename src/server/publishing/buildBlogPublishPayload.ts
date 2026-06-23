import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogPublishArticle } from "./buildBlogPublishArticle";
import type { BlogPublishEventType } from "./types/BlogPublishEventType";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

export const buildBlogPublishPayload = (
  blog: BlogItem,
  eventType: BlogPublishEventType = "update_article",
): BlogPublishPayload => {
  const article = buildBlogPublishArticle(blog);

  if (eventType === "publish_articles") {
    return {
      data: { articles: [article] },
      event_type: eventType,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    data: { article },
    event_type: eventType,
    timestamp: new Date().toISOString(),
  };
};
