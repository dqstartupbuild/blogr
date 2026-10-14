import type { BlogItem } from "../types/BlogItem";

export const countPublishedBlogs = (blogs: BlogItem[]) => {
  return blogs.filter((blog) => blog.status === "published").length;
};
