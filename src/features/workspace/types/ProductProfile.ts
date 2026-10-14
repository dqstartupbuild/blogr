import type { LinkItem } from "./LinkItem";
import type { BlogPublishingIntegration } from "./integrations/BlogPublishingIntegration";
import type { ProductExternalLink } from "./ProductExternalLink";
import type { ProductPrice } from "./ProductPrice";

export type ProductProfile = {
  name: string;
  blogPublishingIntegration?: BlogPublishingIntegration;
  websiteUrl: string;
  niche: string;
  audience: string;
  competitors: string;
  description: string;
  colors: string[];
  externalLinks: ProductExternalLink[];
  features: string[];
  offers: string[];
  pricing: ProductPrice[];
  siteLinks: LinkItem[];
  updatedAt?: number;
};
