import type { BlogItem } from "@/features/workspace/types/BlogItem";

export const collectBlogImageUrls = (blog: BlogItem) => {
  const urls = new Set<string>();

  if (blog.featureImageUrl) urls.add(blog.featureImageUrl);
  blog.images.forEach((image) => {
    if (image.url) urls.add(image.url);
  });

  return Array.from(urls);
};
