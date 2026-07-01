import { buildProductWorkspaceSummary } from "./buildProductWorkspaceSummary";
import { findProductWorkspaceSummary } from "./findProductWorkspaceSummary";
import type { ProductWorkspaceSummarySource } from "./ProductWorkspaceSummarySource";
import type { MutationCtx } from "../_generated/server";

export const upsertProductWorkspaceSummary = async (
  ctx: MutationCtx,
  product: ProductWorkspaceSummarySource,
) => {
  const summary = buildProductWorkspaceSummary(product);
  const existing = await findProductWorkspaceSummary(ctx, product._id);

  if (existing) {
    await ctx.db.patch(existing._id, summary);
    return;
  }

  await ctx.db.insert("productWorkspaceSummaries", summary);
};
