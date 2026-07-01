import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getProductWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const summaries = await ctx.db
      .query("productWorkspaceSummaries")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const selection = await ctx.db
      .query("workspaceSelections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const selectedSummary = selection
      ? await ctx.db
          .query("productWorkspaceSummaries")
          .withIndex("by_productId", (q) => q.eq("productId", selection.productId))
          .first()
      : null;

    if (summaries.length > 0) {
      const activeProductId =
        selectedSummary?.userId === userId
          ? selectedSummary.productId
          : summaries[0]?.productId;

      return {
        activeProductId,
        products: summaries.map((summary) => ({
          _id: summary.productId,
          name: summary.name,
          niche: summary.niche,
          updatedAt: summary.updatedAt,
          websiteUrl: summary.websiteUrl,
        })),
      };
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const selectedProduct = selection ? await ctx.db.get(selection.productId) : null;
    const activeProductId =
      selectedProduct?.userId === userId
        ? selectedProduct._id
        : products[0]?._id;

    return {
      activeProductId,
      products: products.map((product) => ({
        _id: product._id,
        name: product.name,
        niche: product.niche,
        updatedAt: product.updatedAt,
        websiteUrl: product.websiteUrl,
      })),
    };
  },
});
