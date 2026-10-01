import type { LocalState } from "../../domain/LocalState";
import { applyProductFields } from "../applyProductFields";
import { blankProduct } from "./blankProduct";
export const saveProductScan = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const product = productId ? state.products.find((item) => item.id === productId) : blankProduct(String(args.name || ""), String(args.websiteUrl || ""), String(args.niche || ""));
  if (!product) throw new Error("Workspace not found.");
  const oldLinks = product.siteLinks;
  applyProductFields(product, args);
  if (args.preserveSiteLinks) product.siteLinks = oldLinks;
  if (!productId) state.products.push(product);
  state.activeProductId = product.id;
  return product.id;
};
