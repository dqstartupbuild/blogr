import type { ProductDetailsDraft } from "./ProductDetailsDraft";

export type SaveProductDetails = (
  details: ProductDetailsDraft,
  expectedUpdatedAt: number,
) => Promise<void> | void;
