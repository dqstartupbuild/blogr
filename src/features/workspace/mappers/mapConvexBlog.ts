import type { Doc } from "../../../../convex/_generated/dataModel";
import type { BlogItem } from "../types/BlogItem";

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
    slug: blog.slug,
    status: blog.status,
    sources: blog.sources || [],
    seoTitle: blog.seoTitle || blog.title,
    tags: blog.tags || [],
    title: blog.title,
    updatedAt: blog.updatedAt,
    youtubeVideos: blog.youtubeVideos || [],
  };
};
