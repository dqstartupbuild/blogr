import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";

export type StoredProduct = {
  websiteUrl: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  blogGenerationSettings?: BlogGenerationSettings;
  competitors: string;
  colors: string[];
  assets: string[];
  assetKeys?: string[];
  productImages: string[];
  productImageKeys?: string[];
  siteLinks: LinkItem[];
  rawContext: string;
};
