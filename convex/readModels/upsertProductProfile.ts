import { buildProductProfile } from "./buildProductProfile";
import { findProductProfile } from "./findProductProfile";
import type { ProductProfileSource } from "./ProductProfileSource";
import type { MutationCtx } from "../_generated/server";

export const upsertProductProfile = async (
  ctx: MutationCtx,
  product: ProductProfileSource,
) => {
  const profile = buildProductProfile(product);
  const existing = await findProductProfile(ctx, product._id);

  if (existing) {
    await ctx.db.patch(existing._id, profile);
    return;
  }

  await ctx.db.insert("productProfiles", profile);
};
