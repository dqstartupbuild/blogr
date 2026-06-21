import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export const saveWorkspaceSelection = async (
  ctx: MutationCtx,
  userId: string,
  productId: Id<"products">,
) => {
  const existing = await ctx.db
    .query("workspaceSelections")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      productId,
      updatedAt: Date.now(),
    });

    return;
  }

  await ctx.db.insert("workspaceSelections", {
    userId,
    productId,
    updatedAt: Date.now(),
  });
};
