import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicIntentKey } from "./buildTopicIntentKey";
import { buildTopicSearchText } from "./buildTopicSearchText";
import { normalizeTopicKeyword } from "./normalizeTopicKeyword";
import { topicSourceTypeValidator } from "./topicSourceTypeValidator";

export const createScheduledTopic = mutation({
  args: {
    canonicalKeyword: v.optional(v.string()),
    intentKey: v.optional(v.string()),
    keyword: v.string(),
    notes: v.optional(v.string()),
    productId: v.id("products"),
    scheduledDate: v.string(),
    sourceType: v.optional(topicSourceTypeValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);
    const keyword = normalizeTopicKeyword(args.keyword);
    const notes = args.notes?.trim();
    const canonicalKeyword = normalizeTopicKeyword(
      args.canonicalKeyword || keyword,
    );
    const intentKey =
      args.intentKey?.trim() ||
      buildTopicIntentKey(canonicalKeyword) ||
      canonicalKeyword.toLowerCase();
    const sourceType = args.sourceType || "manual";

    if (!keyword) {
      throw new Error("Add a keyword first.");
    }

    const existingForDate = await ctx.db
      .query("topicKeywordOptions")
      .withIndex("by_userId_productId_scheduledDate", (q) =>
        q
          .eq("userId", userId)
          .eq("productId", args.productId)
          .eq("scheduledDate", args.scheduledDate),
      )
      .first();

    if (existingForDate) {
      throw new Error("That day already has a topic.");
    }

    const now = Date.now();

    const topic = {
      canonicalKeyword,
      createdAt: now,
      intentKey,
      keyword,
      notes: notes || undefined,
      productId: args.productId,
      scheduledDate: args.scheduledDate,
      searchText: buildTopicSearchText({
        canonicalKeyword,
        intentKey,
        keyword,
        notes,
        scheduledDate: args.scheduledDate,
        sourceType,
      }),
      sourceType,
      status: "scheduled",
      updatedAt: now,
      userId,
    } as const;
    const topicId = await ctx.db.insert("topics", topic);

    await upsertTopicReadModel(ctx, {
      ...topic,
      _id: topicId,
    });

    return topicId;
  },
});
