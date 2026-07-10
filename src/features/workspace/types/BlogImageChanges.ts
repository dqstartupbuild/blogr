import type { BlogImageItem } from "./BlogImageItem";

export type BlogImageChanges = {
  featureImageUrl?: string;
  images: BlogImageItem[];
  mdx: string;
};
