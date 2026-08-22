import type { BlogItem } from "../types/BlogItem";

export const buildBlogRefreshSeedKeyword = (blog: BlogItem) => {
  return blog.keyword.trim() || blog.title.trim();
};
