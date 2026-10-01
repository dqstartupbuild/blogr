import type { LocalState, LocalProduct } from "../../domain/LocalState";
import { getEditableProduct } from "./getEditableProduct";
export const updateProductSiteLinks = (state: LocalState, args: Record<string, unknown>) => {
  const product = getEditableProduct(state, args);
  product.siteLinks = args.siteLinks as LocalProduct["siteLinks"];
  product.updatedAt = Math.max(Date.now(), product.updatedAt + 1);
  return product.id;
};
