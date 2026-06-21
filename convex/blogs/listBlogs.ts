import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const listBlogs = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db
      .query("blogs")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", args.productId),
      )
      .order("desc")
      .collect();
  },
});
