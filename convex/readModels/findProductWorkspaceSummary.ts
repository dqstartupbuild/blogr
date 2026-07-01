import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findProductWorkspaceSummary = async (
  ctx: MutationCtx | QueryCtx,
  productId: Id<"products">,
) => {
  return await ctx.db
    .query("productWorkspaceSummaries")
    .withIndex("by_productId", (q) => q.eq("productId", productId))
    .first();
};
