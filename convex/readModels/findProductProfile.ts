import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findProductProfile = async (
  ctx: MutationCtx | QueryCtx,
  productId: Id<"products">,
) => {
  return await ctx.db
    .query("productProfiles")
    .withIndex("by_productId", (q) => q.eq("productId", productId))
    .first();
};
