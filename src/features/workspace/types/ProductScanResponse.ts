import type { ProductScanProduct } from "./ProductScanProduct";

export type ProductScanResponse = {
  error?: string;
  product?: ProductScanProduct;
  warning?: string;
};
