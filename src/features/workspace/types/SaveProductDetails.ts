import type { ProductDetailsDraft } from "./ProductDetailsDraft";

export type SaveProductDetails = (
  details: ProductDetailsDraft,
) => Promise<void> | void;
