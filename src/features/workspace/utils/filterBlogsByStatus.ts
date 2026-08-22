import type { BlogItem } from "../types/BlogItem";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";

export const filterBlogsByStatus = (
  blogs: BlogItem[],
  filter: BlogStatusFilter,
) => {
  if (filter === "all") {
    return blogs;
  }

  if (filter === "published") {
    return blogs.filter((blog) => blog.status === "published");
  }

  return blogs.filter((blog) => blog.status !== "published");
};
