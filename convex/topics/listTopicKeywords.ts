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
      status:
        | "saved"
        | "scheduled"
        | "writing"
        | "written"
        | "published"
        | "failed";
    }[] = [];

    if (!productId) {
      return [];
    }

    const topicsQuery = ctx.db
      .query("topicKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .order("desc");

    for await (const topic of topicsQuery) {
      topics.push({
        blogId: topic.blogId,
        canonicalKeyword: topic.canonicalKeyword,
        id: topic.topicId,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        notes: topic.notes,
        scheduledDate: topic.scheduledDate,
        sourceType: topic.sourceType,
        status: topic.status,
      });

    }

    return topics;
  },
});
