import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const listTopicKeywords = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);
    let topicsQuery = ctx.db
      .query("topics")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc");
    const topics: {
      canonicalKeyword?: string;
      intentKey?: string;
      keyword: string;
      scheduledDate?: string;
    }[] = [];

    if (productId) {
      topicsQuery = topicsQuery.filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      );
    }

    for await (const topic of topicsQuery) {
      topics.push({
        canonicalKeyword: topic.canonicalKeyword,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        scheduledDate: topic.scheduledDate,
      });

      if (topics.length >= 250) {
        break;
      }
    }

    return topics;
  },
});
