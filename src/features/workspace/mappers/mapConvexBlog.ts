import type { BlogItem } from "../types/BlogItem";

type ConvexBlogLike = BlogItem & {
  _id?: string;
};

export const mapConvexBlog = (blog: ConvexBlogLike): BlogItem => {
  return {
    ...blog,
    id: blog._id || blog.id,
    images: blog.images || [],
    internalLinks: blog.internalLinks || [],
    sources: blog.sources || [],
    youtubeVideos: blog.youtubeVideos || [],
  };
};
