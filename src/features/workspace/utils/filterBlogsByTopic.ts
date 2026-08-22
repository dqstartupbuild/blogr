import type { BlogItem } from "../types/BlogItem";

export const filterBlogsByTopic = (blogs: BlogItem[], topic: string) => {
  if (topic === "all") {
    return blogs;
  }

  return blogs.filter((blog) => blog.keyword === topic);
};
