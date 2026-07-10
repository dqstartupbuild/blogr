import type { ProductProfile } from "../types/ProductProfile";

export const mapProductScanResult = (
  product: ProductProfile,
): ProductProfile => {
  return {
    audience: product.audience,
    colors: product.colors || [],
    competitors: product.competitors || "",
    description: product.description,
    externalLinks: product.externalLinks || [],
    features: product.features || [],
    name: product.name,
    niche: product.niche,
    offers: product.offers || [],
    pricing: product.pricing || [],
    siteLinks: product.siteLinks || [],
    updatedAt: Date.now(),
    websiteUrl: product.websiteUrl,
  };
};
