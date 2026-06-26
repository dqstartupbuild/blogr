import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

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
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    await ctx.db.patch(args.productId, {
      siteLinks: args.siteLinks,
      updatedAt: Date.now(),
    });
  },
});
