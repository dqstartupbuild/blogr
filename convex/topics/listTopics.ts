import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveReadableProductId } from "../products/resolveReadableProductId";

export const listTopics = query({
  args: {
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveReadableProductId(ctx, userId, args.productId);

    if (!productId) {
      return await ctx.db
        .query("topics")
        .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();
    }

    const scopedTopics = await ctx.db
      .query("topics")
      .withIndex("by_userId_productId_createdAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .order("desc")
      .collect();
    const legacyTopics = await ctx.db
      .query("topics")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return [...scopedTopics, ...legacyTopics.filter((topic) => !topic.productId)]
      .sort((left, right) => right.createdAt - left.createdAt);
  },
});
