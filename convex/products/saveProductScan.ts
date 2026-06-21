import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";
import { defaultBlogGenerationSettings } from "./defaultBlogGenerationSettings";

const linkValidator = v.object({
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

export const saveProductScan = mutation({
  args: {
    productId: v.optional(v.id("products")),
    websiteUrl: v.string(),
    name: v.string(),
    description: v.string(),
    niche: v.string(),
    audience: v.string(),
    competitors: v.string(),
    colors: v.array(v.string()),
    assets: v.array(v.string()),
    assetKeys: v.optional(v.array(v.string())),
    productImages: v.array(v.string()),
    productImageKeys: v.optional(v.array(v.string())),
    siteLinks: v.array(linkValidator),
    rawContext: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const { productId, ...productDetails } = args;
    const existing = productId
      ? await ctx.db.get(productId)
      : await ctx.db
          .query("products")
          .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
          .order("desc")
          .first();

    if (existing && existing.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...productDetails,
        updatedAt: now,
        scannedAt: now,
      });
      await saveWorkspaceSelection(ctx, userId, existing._id);

      return existing._id;
    }

    const nextProductId = await ctx.db.insert("products", {
      ...productDetails,
      userId,
      blogGenerationSettings: defaultBlogGenerationSettings,
      scannedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await saveWorkspaceSelection(ctx, userId, nextProductId);

    return nextProductId;
  },
});
