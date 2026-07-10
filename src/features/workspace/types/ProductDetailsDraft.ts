import type { ProductExternalLink } from "./ProductExternalLink";
import type { ProductPrice } from "./ProductPrice";

export type ProductDetailsDraft = {
  audience: string;
  colors: string[];
  competitors: string;
  description: string;
  externalLinks: ProductExternalLink[];
  features: string[];
  name: string;
  niche: string;
  offers: string[];
  pricing: ProductPrice[];
  websiteUrl: string;
};
