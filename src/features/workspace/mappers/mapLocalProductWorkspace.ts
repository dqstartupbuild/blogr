import type { ProductWorkspace } from "../types/ProductWorkspace";

type LocalProductWorkspaceLike = {
  _id: string;
  name: string;
  niche: string;
  updatedAt: number;
  websiteUrl: string;
};

export const mapLocalProductWorkspace = (
  product: LocalProductWorkspaceLike,
): ProductWorkspace => {
  return {
    id: product._id,
    name: product.name || product.niche || product.websiteUrl || "Workspace",
    niche: product.niche,
    updatedAt: product.updatedAt,
    websiteUrl: product.websiteUrl,
  };
};
