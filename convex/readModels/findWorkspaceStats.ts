import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const findWorkspaceStats = async (
  ctx: MutationCtx | QueryCtx,
  userId: string,
  productId: Id<"products">,
) => {
  return await ctx.db
    .query("workspaceStats")
    .withIndex("by_userId_productId", (q) =>
      q.eq("userId", userId).eq("productId", productId),
    )
    .first();
};
