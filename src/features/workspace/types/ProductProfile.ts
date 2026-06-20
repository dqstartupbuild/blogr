import type { LinkItem } from "./LinkItem";

export type ProductProfile = {
  name: string;
  websiteUrl: string;
  niche: string;
  audience: string;
  description: string;
  colors: string[];
  siteLinks: LinkItem[];
};
