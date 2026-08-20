import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { updateTopicCalendarSchedule } from "./updateTopicCalendarSchedule";

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

    const topicProductId = topic.productId || args.productId;

    if (scheduledDate) {
      if (!topicProductId) {
        throw new Error("Choose a workspace first.");
      }

      if (topic.status !== "saved" && topic.status !== "failed") {
        throw new Error("Only saved or failed topics can be added to the calendar.");
      }

      const existingForDate = await ctx.db
        .query("topicKeywordOptions")
        .withIndex("by_userId_productId_scheduledDate", (q) =>
          q
            .eq("userId", userId)
            .eq("productId", topicProductId)
            .eq("scheduledDate", scheduledDate),
        )
        .first();

      if (existingForDate && existingForDate.topicId !== args.topicId) {
        throw new Error("That day already has a topic.");
      }
    }

    await updateTopicCalendarSchedule(
      ctx,
      topic,
      scheduledDate,
      topicProductId,
      Date.now(),
    );
  },
});
