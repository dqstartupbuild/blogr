import type { LinkItem } from "./LinkItem";

export type BlogItem = {
  id: string;
  keyword: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "ready" | "failed";
  mdx: string;
  featureImageUrl?: string;
  updatedAt: number;
  internalLinks: LinkItem[];
  youtubeVideos: LinkItem[];
  sources: LinkItem[];
};
