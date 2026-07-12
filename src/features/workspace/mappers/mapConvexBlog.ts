import type { Doc } from "../../../../convex/_generated/dataModel";
import type { BlogItem } from "../types/BlogItem";
import { countBlogWords } from "../utils/countBlogWords";

export const mapConvexBlog = (blog: Doc<"blogs">): BlogItem => {
  return {
    createdAt: blog.createdAt,
    excerpt: blog.excerpt,
    featureImageUrl: blog.featureImageUrl,
    id: blog._id,
    images: blog.images || [],
    internalLinks: blog.internalLinks || [],
    keyword: blog.keyword,
    mdx: blog.mdx,
    productId: blog.productId,
    publishedAt: blog.publishedAt,
    slug: blog.slug,
    status: blog.status,
    sources: blog.sources || [],
    seoTitle: blog.seoTitle || blog.title,
    tags: blog.tags || [],
    title: blog.title,
    updatedAt: blog.updatedAt,
    wordCount: countBlogWords(blog.mdx),
    youtubeVideos: blog.youtubeVideos || [],
  };
};
