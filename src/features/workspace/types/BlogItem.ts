import type { LinkItem } from "./LinkItem";
import type { BlogStatus } from "./BlogStatus";

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
  seoTitle: string;
  slug: string;
  excerpt: string;
  status: BlogStatus;
  mdx: string;
  featureImageUrl?: string;
  images: BlogImageItem[];
  updatedAt: number;
  internalLinks: LinkItem[];
  youtubeVideos: LinkItem[];
  sources: LinkItem[];
};
