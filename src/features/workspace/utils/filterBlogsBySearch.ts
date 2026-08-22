import type { BlogItem } from "../types/BlogItem";

export const filterBlogsBySearch = (blogs: BlogItem[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return blogs;
  }

  return blogs.filter((blog) => {
    return [blog.title, blog.excerpt, blog.keyword]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
};
