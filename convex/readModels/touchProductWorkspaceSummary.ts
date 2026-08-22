import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { findProductWorkspaceSummary } from "./findProductWorkspaceSummary";

export const touchProductWorkspaceSummary = async (
  ctx: MutationCtx,
  userId: string,
  productId: Id<"products">,
  updatedAt: number,
) => {
  const summary = await findProductWorkspaceSummary(ctx, productId);

  if (summary?.userId !== userId) {
    return false;
  }

  await ctx.db.patch(summary._id, { updatedAt });

  return true;
};
