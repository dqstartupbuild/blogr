import type { LinkItem } from "./LinkItem";

export type ProductScanProduct = {
  assets: string[];
  assetKeys?: string[];
  audience: string;
  colors: string[];
  competitors: string;
  description: string;
  name: string;
  niche: string;
  productImages: string[];
  productImageKeys?: string[];
  rawContext: string;
  siteLinks: LinkItem[];
  websiteUrl: string;
};
