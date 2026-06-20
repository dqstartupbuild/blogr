import type { LinkItem } from "./LinkItem";

export type ProductScanProduct = {
  assets: string[];
  audience: string;
  colors: string[];
  competitors: string;
  description: string;
  name: string;
  niche: string;
  productImages: string[];
  rawContext: string;
  siteLinks: LinkItem[];
  websiteUrl: string;
};
