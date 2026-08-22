import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicIntentKey } from "./buildTopicIntentKey";
import { buildTopicSearchText } from "./buildTopicSearchText";
import { normalizeTopicKeyword } from "./normalizeTopicKeyword";

export const createTopic = mutation({
  args: {
    productId: v.id("products"),
    keyword: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);
    const keyword = normalizeTopicKeyword(args.keyword);
    const intentKey = buildTopicIntentKey(keyword) || keyword.toLowerCase();
    const notes = args.notes?.trim();

    if (!keyword) {
      throw new Error("Add a keyword first.");
    }

    const now = Date.now();

    const topic = {
      userId,
      productId: args.productId,
      canonicalKeyword: keyword,
      intentKey: intentKey || keyword.toLowerCase(),
      keyword,
      searchText: buildTopicSearchText({
        canonicalKeyword: keyword,
        intentKey,
        keyword,
        notes,
        sourceType: "manual",
      }),
      notes: notes || undefined,
      sourceType: "manual",
      status: "saved",
      createdAt: now,
      updatedAt: now,
    } as const;
    const topicId = await ctx.db.insert("topics", topic);

    await upsertTopicReadModel(ctx, {
      ...topic,
      _id: topicId,
    });

    return topicId;
  },
});
