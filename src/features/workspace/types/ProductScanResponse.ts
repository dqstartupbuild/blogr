import type { ProductScanProduct } from "./ProductScanProduct";

export type ProductScanResponse = {
  error?: string;
  jobId?: string;
  product?: ProductScanProduct;
  status?: "queued" | "running" | "succeeded" | "failed";
};
