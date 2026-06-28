import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogPublishArticle } from "./buildBlogPublishArticle";
import { getBlogPublishTimestamp } from "./getBlogPublishTimestamp";
import type { BlogPublishEventType } from "./types/BlogPublishEventType";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

export const buildBlogPublishPayload = (
  blog: BlogItem,
  eventType: BlogPublishEventType = "update_article",
  sourceName?: string,
): BlogPublishPayload => {
  const publishTimestamp = getBlogPublishTimestamp();
  const article = buildBlogPublishArticle(blog, {
    publishTimestamp,
    sourceName,
  });

  if (eventType === "publish_articles") {
    return {
      data: { articles: [article] },
      event_type: eventType,
      timestamp: publishTimestamp,
    };
  }

  return {
    data: { article },
    event_type: eventType,
    timestamp: publishTimestamp,
  };
};
