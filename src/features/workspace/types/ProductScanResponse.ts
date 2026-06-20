import type { ProductProfile } from "./ProductProfile";

export type ProductScanResponse = {
  error?: string;
  product?: ProductProfile;
  saved?: boolean;
};
