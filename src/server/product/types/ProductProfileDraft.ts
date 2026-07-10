import type { ProductExternalLink } from "@/features/workspace/types/ProductExternalLink";
import type { ProductPrice } from "@/features/workspace/types/ProductPrice";

export type ProductProfileDraft = {
  name?: string;
  description?: string;
  niche?: string;
  audience?: string;
  competitors?: string;
  colors?: string[];
  externalLinks?: ProductExternalLink[];
  features?: string[];
  offers?: string[];
  pricing?: ProductPrice[];
};
