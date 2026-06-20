import type { MutationCtx, QueryCtx } from "../_generated/server";

export const requireUserId = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity.subject;
};
