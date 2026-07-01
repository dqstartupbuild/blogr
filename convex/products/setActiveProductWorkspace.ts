import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";
import { resolveActiveProductId } from "./resolveActiveProductId";

export const setActiveProductWorkspace = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);

    await saveWorkspaceSelection(ctx, userId, args.productId);
  },
});
