import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";

export const setActiveProductWorkspace = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    await saveWorkspaceSelection(ctx, userId, args.productId);
  },
});
