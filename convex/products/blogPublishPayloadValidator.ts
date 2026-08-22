import { v } from "convex/values";
import { blogPublishArticleValidator } from "./blogPublishArticleValidator";

export const blogPublishPayloadValidator = v.object({
  data: v.object({
    article: v.optional(blogPublishArticleValidator),
    articles: v.optional(v.array(blogPublishArticleValidator)),
  }),
  event_type: v.union(v.literal("publish_articles"), v.literal("update_article")),
  timestamp: v.string(),
});
