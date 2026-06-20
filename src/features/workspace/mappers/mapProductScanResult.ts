import type { ProductProfile } from "../types/ProductProfile";

export const mapProductScanResult = (
  product: ProductProfile,
): ProductProfile => {
  return {
    audience: product.audience,
    colors: product.colors || [],
    description: product.description,
    name: product.name,
    niche: product.niche,
    siteLinks: product.siteLinks || [],
    websiteUrl: product.websiteUrl,
  };
};
