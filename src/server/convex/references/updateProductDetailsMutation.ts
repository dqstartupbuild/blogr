import { makeFunctionReference } from "convex/server";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { ProductDetailsDraft } from "@/features/workspace/types/ProductDetailsDraft";

type UpdateProductDetailsMutationArgs = ProductDetailsDraft & {
  productId: Id<"products">;
};

export const updateProductDetailsMutation = makeFunctionReference<
  "mutation",
  UpdateProductDetailsMutationArgs,
  null
>("products/updateProductDetails:updateProductDetails");
