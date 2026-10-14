import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { BlogImage } from "./BlogImage";

export type GeneratedBlog = {
  keyword: string;
  title: string;
  seoTitle: string;
  slug: string;
  excerpt: string;
  status: "draft" | "ready" | "failed";
  mdx: string;
  featureImageUrl?: string;
  images: BlogImage[];
  internalLinks: LinkItem[];
  youtubeVideos: LinkItem[];
  sources: LinkItem[];
  tags: string[];
};
