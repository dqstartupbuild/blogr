import type { Id } from "../../../convex/_generated/dataModel";

export const castProductId = (productId: string) => {
  return productId as Id<"products">;
};
