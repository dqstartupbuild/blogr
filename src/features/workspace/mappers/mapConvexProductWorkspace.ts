import type { ProductWorkspace } from "../types/ProductWorkspace";

type ConvexProductWorkspaceLike = {
  _id: string;
  name: string;
  niche: string;
  updatedAt: number;
  websiteUrl: string;
};

export const mapConvexProductWorkspace = (
  product: ConvexProductWorkspaceLike,
): ProductWorkspace => {
  return {
    id: product._id,
    name: product.name || product.niche || product.websiteUrl || "Workspace",
    niche: product.niche,
    updatedAt: product.updatedAt,
    websiteUrl: product.websiteUrl,
  };
};
