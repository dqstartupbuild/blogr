import type { LinkItem } from "@/features/workspace/types/LinkItem";

export type TopicDiscoveryProduct = {
  audience: string;
  competitors?: string;
  description: string;
  name: string;
  niche: string;
  rawContext?: string;
  siteLinks?: LinkItem[];
  websiteUrl: string;
};
