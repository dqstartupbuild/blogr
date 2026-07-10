import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { productExternalLinkValidator } from "./productExternalLinkValidator";
import { productPriceValidator } from "./productPriceValidator";
import { sanitizeProductExternalLinks } from "./sanitizeProductExternalLinks";
import { sanitizeProductPrices } from "./sanitizeProductPrices";
import { sanitizeProductStringList } from "./sanitizeProductStringList";

export const updateProductDetails = mutation({
  args: {
    audience: v.string(),
    colors: v.array(v.string()),
    competitors: v.string(),
    description: v.string(),
    externalLinks: v.array(productExternalLinkValidator),
    features: v.array(v.string()),
    name: v.string(),
    niche: v.string(),
    offers: v.array(v.string()),
    pricing: v.array(productPriceValidator),
    productId: v.id("products"),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    const now = Date.now();
    const details = {
      audience: args.audience.trim(),
      colors: sanitizeProductStringList(args.colors),
      competitors: args.competitors.trim(),
      description: args.description.trim(),
      externalLinks: sanitizeProductExternalLinks(args.externalLinks),
      features: sanitizeProductStringList(args.features),
      name: args.name.trim() || product.name,
      niche: args.niche.trim(),
      offers: sanitizeProductStringList(args.offers),
      pricing: sanitizeProductPrices(args.pricing),
      updatedAt: now,
      websiteUrl: args.websiteUrl.trim(),
    };
    const updatedProduct = { ...product, ...details };

    await ctx.db.patch(args.productId, details);
    await upsertProductWorkspaceSummary(ctx, updatedProduct);
    await upsertProductProfile(ctx, updatedProduct);
  },
});
