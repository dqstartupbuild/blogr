import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { ProductExternalLink } from "@/features/workspace/types/ProductExternalLink";
import type { ProductPrice } from "@/features/workspace/types/ProductPrice";

export type StoredProduct = {
  websiteUrl: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  blogGenerationSettings?: BlogGenerationSettings;
  competitors: string;
  colors: string[];
  externalLinks: ProductExternalLink[];
  features: string[];
  offers: string[];
  pricing: ProductPrice[];
  assets: string[];
  assetKeys?: string[];
  productImages: string[];
  productImageKeys?: string[];
  siteLinks: LinkItem[];
  rawContext: string;
};
