import type { LinkItem } from "./LinkItem";
import type { ProductExternalLink } from "./ProductExternalLink";
import type { ProductPrice } from "./ProductPrice";

export type ProductScanProduct = {
  assets: string[];
  assetKeys?: string[];
  audience: string;
  colors: string[];
  competitors: string;
  description: string;
  externalLinks: ProductExternalLink[];
  features: string[];
  name: string;
  niche: string;
  productImages: string[];
  productImageKeys?: string[];
  offers: string[];
  pricing: ProductPrice[];
  rawContext: string;
  siteLinks: LinkItem[];
  websiteUrl: string;
};
