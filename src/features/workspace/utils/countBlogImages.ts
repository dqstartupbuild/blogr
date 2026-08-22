import type { BlogItem } from "../types/BlogItem";

export const countBlogImages = (blog: BlogItem) => {
  const imageUrls = new Set(
    [blog.featureImageUrl, ...blog.images.map((image) => image.url)].filter(
      Boolean,
    ),
  );

  return imageUrls.size;
};
