import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getPreviewUserId } from "./getPreviewUserId";

export const requireUserId = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    const previewUserId = getPreviewUserId();

    if (previewUserId) {
      return previewUserId;
    }
  }

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity.subject;
};
