import type { LinkItem } from "./LinkItem";

type BlogImageItem = {
  alt: string;
  prompt: string;
  r2Key?: string;
  url: string;
};

export type BlogItem = {
  createdAt?: number;
  id: string;
  keyword: string;
  productId?: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "ready" | "failed";
  mdx: string;
  featureImageUrl?: string;
  images: BlogImageItem[];
  updatedAt: number;
  internalLinks: LinkItem[];
  youtubeVideos: LinkItem[];
  sources: LinkItem[];
};
