import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { patchProductProfile } from "../readModels/patchProductProfile";
import { touchProductWorkspaceSummary } from "../readModels/touchProductWorkspaceSummary";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { blogGenerationSettingsValidator } from "./blogGenerationSettingsValidator";
import { resolveActiveProductId } from "./resolveActiveProductId";

export const updateBlogGenerationSettings = mutation({
  args: {
    productId: v.id("products"),
    settings: blogGenerationSettingsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);

    if ((args.settings.associateBrandLinks || []).length > 5) {
      throw new Error("Add up to 5 associate brand links.");
    }

    const now = Date.now();

    await ctx.db.patch(args.productId, {
      blogGenerationSettings: args.settings,
      updatedAt: now,
    });
    const touchedSummary = await touchProductWorkspaceSummary(
      ctx,
      userId,
      args.productId,
      now,
    );
    const patchedProfile = await patchProductProfile(ctx, userId, args.productId, {
      blogGenerationSettings: args.settings,
      updatedAt: now,
    });

    if (touchedSummary && patchedProfile) {
      return;
    }

    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    await upsertProductWorkspaceSummary(ctx, product);
    await upsertProductProfile(ctx, product);
  },
});
