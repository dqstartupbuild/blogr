import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";

export const listScheduledTopics = query({
  args: {
    endDate: v.string(),
    productId: v.optional(v.id("products")),
    startDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);

    if (!productId) {
      return [];
    }

    const topics = await ctx.db
      .query("topics")
      .withIndex("by_userId_productId_scheduledDate", (q) =>
        q
          .eq("userId", userId)
          .eq("productId", productId)
          .gte("scheduledDate", args.startDate)
          .lte("scheduledDate", args.endDate),
      )
      .collect();

    return topics.sort((left, right) =>
      (left.scheduledDate || "").localeCompare(right.scheduledDate || ""),
    );
  },
});
