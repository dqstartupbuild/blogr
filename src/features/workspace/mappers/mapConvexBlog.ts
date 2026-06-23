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
    slug: blog.slug,
    status: blog.status,
    sources: blog.sources || [],
    title: blog.title,
    updatedAt: blog.updatedAt,
    youtubeVideos: blog.youtubeVideos || [],
  };
};
