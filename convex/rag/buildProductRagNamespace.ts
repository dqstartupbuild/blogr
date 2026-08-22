import type { Id } from "../_generated/dataModel";

export const buildProductRagNamespace = (productId: Id<"products">) => {
  return `product:${productId}`;
};
