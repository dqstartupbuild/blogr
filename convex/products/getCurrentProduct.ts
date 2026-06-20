import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getCurrentProduct = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    return await ctx.db
      .query("products")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});
