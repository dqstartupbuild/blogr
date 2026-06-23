import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { sanitizeProductForClient } from "./sanitizeProductForClient";

export const getProductWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const products = await ctx.db
      .query("products")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const selection = await ctx.db
      .query("workspaceSelections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const selectedProduct = selection
      ? await ctx.db.get(selection.productId)
      : null;
    const activeProductId =
      selectedProduct?.userId === userId
        ? selectedProduct._id
        : products[0]?._id;

    return {
      activeProductId,
      products: products.map(sanitizeProductForClient),
    };
  },
});
