import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { saveWorkspaceSelection } from "../workspaceSelections/saveWorkspaceSelection";
import { defaultBlogGenerationSettings } from "./defaultBlogGenerationSettings";
import { productExternalLinkValidator } from "./productExternalLinkValidator";
import { productPriceValidator } from "./productPriceValidator";

const linkValidator = v.object({
  isActive: v.optional(v.boolean()),
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

export const saveProductScan = mutation({
  args: {
    productId: v.optional(v.id("products")),
    preserveSiteLinks: v.optional(v.boolean()),
    websiteUrl: v.string(),
    name: v.string(),
    description: v.string(),
    niche: v.string(),
    audience: v.string(),
    competitors: v.string(),
    colors: v.array(v.string()),
    externalLinks: v.array(productExternalLinkValidator),
    features: v.array(v.string()),
    assets: v.array(v.string()),
    assetKeys: v.optional(v.array(v.string())),
    productImages: v.array(v.string()),
    productImageKeys: v.optional(v.array(v.string())),
    offers: v.array(v.string()),
    pricing: v.array(productPriceValidator),
    siteLinks: v.array(linkValidator),
    rawContext: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const { preserveSiteLinks, productId, ...scannedProductDetails } = args;
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
      const productDetails = preserveSiteLinks
        ? {
            ...scannedProductDetails,
            siteLinks: existing.siteLinks,
          }
        : scannedProductDetails;
      const updatedProduct = {
        ...existing,
        ...productDetails,
        updatedAt: now,
        scannedAt: now,
      };

      await ctx.db.patch(existing._id, {
        ...productDetails,
        updatedAt: now,
        scannedAt: now,
      });
      await upsertProductWorkspaceSummary(ctx, updatedProduct);
      await upsertProductProfile(ctx, updatedProduct);
      await saveWorkspaceSelection(ctx, userId, existing._id);

      return existing._id;
    }

    const nextProduct = {
      ...scannedProductDetails,
      userId,
      blogGenerationSettings: defaultBlogGenerationSettings,
      scannedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    const nextProductId = await ctx.db.insert("products", nextProduct);

    await upsertProductWorkspaceSummary(ctx, {
      ...nextProduct,
      _id: nextProductId,
    });
    await upsertProductProfile(ctx, {
      ...nextProduct,
      _id: nextProductId,
    });
    await saveWorkspaceSelection(ctx, userId, nextProductId);

    return nextProductId;
  },
});
