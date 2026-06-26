import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { blogGenerationSettingsValidator } from "./blogGenerationSettingsValidator";

export const updateBlogGenerationSettings = mutation({
  args: {
    productId: v.id("products"),
    settings: blogGenerationSettingsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    if ((args.settings.associateBrandLinks || []).length > 5) {
      throw new Error("Add up to 5 associate brand links.");
    }

    await ctx.db.patch(args.productId, {
      blogGenerationSettings: args.settings,
      updatedAt: Date.now(),
    });
  },
});
