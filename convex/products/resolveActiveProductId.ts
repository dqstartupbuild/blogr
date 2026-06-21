import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const resolveActiveProductId = async (
  ctx: MutationCtx | QueryCtx,
  userId: string,
  productId?: Id<"products">,
) => {
  if (productId) {
    const product = await ctx.db.get(productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    return productId;
  }

  const selection = await ctx.db
    .query("workspaceSelections")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  const selectedProduct = selection
    ? await ctx.db.get(selection.productId)
    : null;

  if (selectedProduct?.userId === userId) {
    return selectedProduct._id;
  }

  const latestProduct = await ctx.db
    .query("products")
    .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
    .order("desc")
    .first();

  return latestProduct?._id ?? null;
};
