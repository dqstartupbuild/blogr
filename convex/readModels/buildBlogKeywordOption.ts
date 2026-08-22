import type { BlogReadModelSource } from "./BlogReadModelSource";

export const buildBlogKeywordOption = (blog: BlogReadModelSource) => {
  if (!blog.productId) {
    return null;
  }

  return {
    blogId: blog._id,
    excerpt: blog.excerpt,
    keyword: blog.keyword,
    productId: blog.productId,
    title: blog.title,
    updatedAt: blog.updatedAt,
    userId: blog.userId,
  };
};
