import type { LocalState } from "../../domain/LocalState";
import { applyProductFields } from "../applyProductFields";
import { getEditableProduct } from "./getEditableProduct";
export const updateProductDetails = (state: LocalState, args: Record<string, unknown>) => {
  const product = getEditableProduct(state, args);
  if (args.expectedProductUpdatedAt !== product.updatedAt) throw new Error("This project changed on another tab. Reload it before saving your edits.");
  applyProductFields(product, args);
  return product.id;
};
