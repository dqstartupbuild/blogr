import type { ProductWorkspaceSummarySource } from "./ProductWorkspaceSummarySource";

export const buildProductWorkspaceSummary = (
  product: ProductWorkspaceSummarySource,
) => {
  return {
    name: product.name,
    niche: product.niche,
    productId: product._id,
    updatedAt: product.updatedAt,
    userId: product.userId,
    websiteUrl: product.websiteUrl,
  };
};
