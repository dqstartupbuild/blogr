import type { BlogItem } from "../types/BlogItem";

export const getBlogPublishedAt = (blog: BlogItem) => {
  if (blog.publishedAt) {
    return blog.publishedAt;
  }

  if (blog.status === "published") {
    return blog.updatedAt;
  }

  return undefined;
};
