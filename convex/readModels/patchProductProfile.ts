import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { findProductProfile } from "./findProductProfile";

export const patchProductProfile = async (
  ctx: MutationCtx,
  userId: string,
  productId: Id<"products">,
  patch: Partial<Doc<"productProfiles">>,
) => {
  const profile = await findProductProfile(ctx, productId);

  if (profile?.userId !== userId) {
    return false;
  }

  await ctx.db.patch(profile._id, patch);

  return true;
};
