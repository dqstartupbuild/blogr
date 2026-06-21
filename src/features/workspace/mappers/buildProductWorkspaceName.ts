import type { ProductProfile } from "../types/ProductProfile";

export const buildProductWorkspaceName = (product: ProductProfile) => {
  return product.name || product.niche || product.websiteUrl || "Workspace";
};
