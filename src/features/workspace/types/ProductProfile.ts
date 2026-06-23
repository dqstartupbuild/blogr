import type { LinkItem } from "./LinkItem";
import type { BlogPublishingIntegration } from "./integrations/BlogPublishingIntegration";

export type ProductProfile = {
  name: string;
  blogPublishingIntegration?: BlogPublishingIntegration;
  websiteUrl: string;
  niche: string;
  audience: string;
  description: string;
  colors: string[];
  siteLinks: LinkItem[];
};
