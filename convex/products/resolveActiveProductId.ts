import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const resolveActiveProductId = async (
  ctx: MutationCtx | QueryCtx,
  userId: string,
  productId?: Id<"products">,
) => {
  if (productId) {
    const profile = await ctx.db
      .query("productProfiles")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .first();

    if (profile) {
      return productId;
    }

    const summary = await ctx.db
      .query("productWorkspaceSummaries")
      .withIndex("by_productId", (q) => q.eq("productId", productId))
      .first();

    if (summary?.userId === userId) {
      return productId;
    }

    const product = await ctx.db.get(productId);

    if (product?.userId === userId) {
      return productId;
    }

    throw new Error("Workspace not found.");
  }

  const selection = await ctx.db
    .query("workspaceSelections")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  const selectedProfile = selection
    ? await ctx.db
        .query("productProfiles")
        .withIndex("by_userId_productId", (q) =>
          q.eq("userId", userId).eq("productId", selection.productId),
        )
        .first()
    : null;

  if (selectedProfile) {
    return selectedProfile.productId;
  }

  const selectedSummary = selection
    ? await ctx.db
        .query("productWorkspaceSummaries")
        .withIndex("by_productId", (q) => q.eq("productId", selection.productId))
        .first()
    : null;

  if (selectedSummary?.userId === userId) {
    return selectedSummary.productId;
  }

  const latestProfile = await ctx.db
    .query("productProfiles")
    .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
    .order("desc")
    .first();

  if (latestProfile) {
    return latestProfile.productId;
  }

  const latestProduct = await ctx.db
    .query("products")
    .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
    .order("desc")
    .first();

  return latestProduct?._id ?? null;
};
