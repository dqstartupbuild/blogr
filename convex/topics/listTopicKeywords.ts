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
      blogId?: string;
      id: string;
      intentKey?: string;
      keyword: string;
      notes?: string;
      scheduledDate?: string;
      sourceType?:
        | "manual"
        | "discovery"
        | "gap"
        | "comparison"
        | "question"
        | "cluster"
        | "refresh"
        | "aeo"
        | "difficulty";
      status: "saved" | "scheduled" | "writing" | "written" | "failed";
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
        blogId: topic.blogId,
        canonicalKeyword: topic.canonicalKeyword,
        id: topic._id,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        notes: topic.notes,
        scheduledDate: topic.scheduledDate,
        sourceType: topic.sourceType,
        status: topic.status,
      });

      if (topics.length >= 250) {
        break;
      }
    }

    return topics;
  },
});
