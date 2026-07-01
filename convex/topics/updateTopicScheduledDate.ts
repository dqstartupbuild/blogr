import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { buildTopicSearchText } from "./buildTopicSearchText";

export const updateTopicScheduledDate = mutation({
  args: {
    productId: v.optional(v.id("products")),
    scheduledDate: v.union(v.string(), v.null()),
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);
    const scheduledDate = args.scheduledDate || undefined;

    if (!topic || topic.userId !== userId) {
      throw new Error("Topic not found.");
    }

    if (
      args.productId &&
      topic.productId &&
      topic.productId !== args.productId
    ) {
      throw new Error("Topic not found in this workspace.");
    }

    if (scheduledDate) {
      if (topic.status !== "saved" && topic.status !== "failed") {
        throw new Error("Only saved or failed topics can be added to the calendar.");
      }

      const existingForDate = await ctx.db
        .query("topics")
        .withIndex("by_userId_productId_scheduledDate", (q) =>
          q
            .eq("userId", userId)
            .eq("productId", topic.productId || args.productId)
            .eq("scheduledDate", scheduledDate),
        )
        .first();

      if (existingForDate && existingForDate._id !== args.topicId) {
        throw new Error("That day already has a topic.");
      }
    }

    await ctx.db.patch(args.topicId, {
      productId: topic.productId || args.productId,
      scheduledDate,
      searchText: buildTopicSearchText({
        canonicalKeyword: topic.canonicalKeyword,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        notes: topic.notes,
        scheduledDate,
        sourceType: topic.sourceType,
      }),
      status:
        scheduledDate && topic.status === "saved"
          ? "scheduled"
          : !scheduledDate && topic.status === "scheduled"
            ? "saved"
            : topic.status,
      updatedAt: Date.now(),
    });
  },
});
