import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { isValidCalendarDateKey } from "../products/isValidCalendarDateKey";
import { updateTopicCalendarSchedule } from "./updateTopicCalendarSchedule";

export const quickFillExistingTopics = mutation({
  args: { productId: v.id("products"), scheduledDates: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx); await resolveActiveProductId(ctx, userId, args.productId);
    if (args.scheduledDates.length > 30) throw new Error("Choose up to 30 calendar dates.");
    if (args.scheduledDates.some((date) => !isValidCalendarDateKey(date))) throw new Error("Choose valid calendar dates.");
    const dates = Array.from(new Set(args.scheduledDates)).sort();
    const allTopics = await ctx.db.query("topics").withIndex("by_userId_productId_createdAt", (q) => q.eq("userId", userId).eq("productId", args.productId)).collect();
    const occupied = new Set(allTopics.map((topic) => topic.scheduledDate).filter(Boolean));
    const openDates = dates.filter((date) => !occupied.has(date));
    const eligible = allTopics.filter((topic) => !topic.scheduledDate && (topic.status === "saved" || topic.status === "failed")).sort((a, b) => a.createdAt - b.createdAt || a._creationTime - b._creationTime || String(a._id).localeCompare(String(b._id)));
    const count = Math.min(openDates.length, eligible.length, 30); const now = Date.now();
    for (let index = 0; index < count; index += 1) {
      const topic = eligible[index];
      const scheduledDate = openDates[index];

      await updateTopicCalendarSchedule(
        ctx,
        topic,
        scheduledDate,
        args.productId,
        now,
      );
    }
    return { scheduledCount: count, skippedOccupiedDateCount: dates.length - openDates.length, unusedDateCount: openDates.length - count };
  },
});
