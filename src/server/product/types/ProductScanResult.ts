import type { LinkItem } from "@/features/workspace/types/LinkItem";

export type ProductScanResult = {
  websiteUrl: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  competitors: string;
  colors: string[];
  assets: string[];
  productImages: string[];
  siteLinks: LinkItem[];
  rawContext: string;
};
