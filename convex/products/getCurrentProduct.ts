import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { refreshProductImageUrls } from "./refreshProductImageUrls";

export const getCurrentProduct = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const selection = await ctx.db
      .query("workspaceSelections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const selectedProduct = selection
      ? await ctx.db.get(selection.productId)
      : null;

    if (selectedProduct?.userId === userId) {
      return await refreshProductImageUrls(selectedProduct);
    }

    const fallbackProduct = await ctx.db
      .query("products")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    return fallbackProduct ? await refreshProductImageUrls(fallbackProduct) : null;
  },
});
