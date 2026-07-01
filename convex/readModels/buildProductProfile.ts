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
    description: product.description,
    name: product.name,
    niche: product.niche,
    productId: product._id,
    siteLinks: product.siteLinks,
    updatedAt: product.updatedAt,
    userId: product.userId,
    websiteUrl: product.websiteUrl,
  };
};
