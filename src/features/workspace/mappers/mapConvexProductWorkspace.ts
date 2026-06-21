import type { Doc } from "../../../../convex/_generated/dataModel";
import type { ProductWorkspace } from "../types/ProductWorkspace";

export const mapConvexProductWorkspace = (
  product: Doc<"products">,
): ProductWorkspace => {
  return {
    id: product._id,
    name: product.name || product.niche || product.websiteUrl || "Workspace",
    niche: product.niche,
    updatedAt: product.updatedAt,
    websiteUrl: product.websiteUrl,
  };
};
