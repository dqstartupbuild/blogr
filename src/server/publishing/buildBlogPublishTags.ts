import type { BlogItem } from "@/features/workspace/types/BlogItem";

export const buildBlogPublishTags = (blog: BlogItem) => {
  const tags = new Set<string>();
  const keyword = blog.keyword.trim();

  if (keyword) {
    tags.add(keyword);
  }

  return Array.from(tags);
};
