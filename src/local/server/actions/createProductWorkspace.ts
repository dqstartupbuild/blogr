import type { LocalState } from "../../domain/LocalState";
import { blankProduct } from "./blankProduct";
export const createProductWorkspace = (state: LocalState, args: Record<string, unknown>) => {
  const product = blankProduct(String(args.name || ""), String(args.websiteUrl || ""), String(args.niche || ""));
  state.products.push(product);
  state.activeProductId = product.id;
  return product.id;
};
