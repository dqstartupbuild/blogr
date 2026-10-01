import type { BlogItem } from "@/features/workspace/types/BlogItem";

const keys = ["keyword", "title", "seoTitle", "slug", "excerpt", "mdx", "status", "featureImageUrl", "images", "internalLinks", "youtubeVideos", "sources", "tags"] as const;

export const pickGeneratedBlogFields = (input: Record<string, unknown>): Partial<BlogItem> => {
  const fields: Record<string, unknown> = {};
  for (const key of keys) if (Object.hasOwn(input, key)) fields[key] = input[key];
  return fields as Partial<BlogItem>;
};
