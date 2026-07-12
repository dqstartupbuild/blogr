import type { BlogReadModelSource } from "./BlogReadModelSource";
import { countBlogImageRefs } from "./countBlogImageRefs";
import { countBlogWordsFromMdx } from "./countBlogWordsFromMdx";

export const buildBlogSummary = (blog: BlogReadModelSource) => {
  if (!blog.productId) {
    return null;
  }

  return {
    blogId: blog._id,
    createdAt: blog.createdAt,
    excerpt: blog.excerpt,
    featureImageUrl: blog.featureImageUrl,
    imageCount: countBlogImageRefs(blog),
    isPublished: blog.status === "published",
    keyword: blog.keyword,
    productId: blog.productId,
    publishedAt: blog.publishedAt,
    searchText: blog.searchText,
    seoTitle: blog.seoTitle,
    slug: blog.slug,
    status: blog.status,
    tags: blog.tags,
    title: blog.title,
    topicId: blog.topicId,
    updatedAt: blog.updatedAt,
    userId: blog.userId,
    wordCount: countBlogWordsFromMdx(blog.mdx),
  };
};
