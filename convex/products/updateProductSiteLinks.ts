import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { patchProductProfile } from "../readModels/patchProductProfile";
import { touchProductWorkspaceSummary } from "../readModels/touchProductWorkspaceSummary";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { resolveActiveProductId } from "./resolveActiveProductId";

const linkValidator = v.object({
  isActive: v.optional(v.boolean()),
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

export const updateProductSiteLinks = mutation({
  args: {
    productId: v.id("products"),
    siteLinks: v.array(linkValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await resolveActiveProductId(ctx, userId, args.productId);

    const now = Date.now();

    await ctx.db.patch(args.productId, {
      siteLinks: args.siteLinks,
      updatedAt: now,
    });
    const touchedSummary = await touchProductWorkspaceSummary(
      ctx,
      userId,
      args.productId,
      now,
    );
    const patchedProfile = await patchProductProfile(ctx, userId, args.productId, {
      siteLinks: args.siteLinks,
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
