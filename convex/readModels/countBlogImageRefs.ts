import type { BlogReadModelSource } from "./BlogReadModelSource";

export const countBlogImageRefs = (blog: BlogReadModelSource) => {
  const imageUrls = new Set(
    [blog.featureImageUrl, ...blog.images.map((image) => image.url)].filter(
      Boolean,
    ),
  );

  return imageUrls.size;
};
