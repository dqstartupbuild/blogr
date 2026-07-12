import type { LinkItem } from "./LinkItem";
import type { BlogStatus } from "./BlogStatus";
import type { BlogImageItem } from "./BlogImageItem";

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
  isSummary?: boolean;
  mdx: string;
  publishedAt?: number;
  wordCount?: number;
  featureImageUrl?: string;
  images: BlogImageItem[];
  updatedAt: number;
  internalLinks: LinkItem[];
  youtubeVideos: LinkItem[];
  sources: LinkItem[];
  tags: string[];
};
