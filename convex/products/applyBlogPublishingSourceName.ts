import type { Infer } from "convex/values";
import type { blogPublishPayloadValidator } from "./blogPublishPayloadValidator";

type BlogPublishPayload = Infer<typeof blogPublishPayloadValidator>;

export const applyBlogPublishingSourceName = (
  payload: BlogPublishPayload,
  sourceName: string,
): BlogPublishPayload => {
  if (payload.event_type === "publish_articles") {
    return {
      ...payload,
      data: {
        articles: (payload.data.articles || []).map((article) => ({
          ...article,
          source: sourceName,
        })),
      },
    };
  }

  return {
    ...payload,
    data: {
      article: payload.data.article
        ? {
            ...payload.data.article,
            source: sourceName,
          }
        : undefined,
    },
  };
};
