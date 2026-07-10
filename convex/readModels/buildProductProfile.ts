import { sanitizeBlogPublishingIntegration } from "../products/sanitizeBlogPublishingIntegration";
import type { ProductProfileSource } from "./ProductProfileSource";

export const buildProductProfile = (product: ProductProfileSource) => {
  return {
    audience: product.audience,
    blogGenerationSettings: product.blogGenerationSettings,
    blogPublishingIntegration: sanitizeBlogPublishingIntegration(
      product.blogPublishingIntegration,
    ),
    colors: product.colors,
    competitors: product.competitors,
    description: product.description,
    externalLinks: product.externalLinks || [],
    features: product.features || [],
    name: product.name,
    niche: product.niche,
    offers: product.offers || [],
    pricing: product.pricing || [],
    productId: product._id,
    siteLinks: product.siteLinks,
    updatedAt: product.updatedAt,
    userId: product.userId,
    websiteUrl: product.websiteUrl,
  };
};
