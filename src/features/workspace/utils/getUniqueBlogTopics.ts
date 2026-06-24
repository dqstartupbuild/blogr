import type { BlogItem } from "../types/BlogItem";

export const getUniqueBlogTopics = (blogs: BlogItem[]) => {
  return Array.from(new Set(blogs.map((blog) => blog.keyword))).sort((a, b) =>
    a.localeCompare(b),
  );
};
