import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogPublishArticle } from "./buildBlogPublishArticle";
import { buildBlogPublishMedia } from "./buildBlogPublishMedia";
import { getBlogPublishCreatedAt } from "./getBlogPublishCreatedAt";
import { getBlogPublishTimestamp } from "./getBlogPublishTimestamp";
import type { BlogPublishEventType } from "./types/BlogPublishEventType";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

export const buildBlogPublishPayload = async (
  blog: BlogItem,
  eventType: BlogPublishEventType = "update_article",
  sourceName?: string,
): Promise<BlogPublishPayload> => {
  const publishTimestamp = getBlogPublishTimestamp();
  const media = await buildBlogPublishMedia(blog);
  const article = buildBlogPublishArticle(blog, {
    createdAt: getBlogPublishCreatedAt(blog, eventType, publishTimestamp),
    sourceName,
    updatedAt: publishTimestamp,
    media,
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
