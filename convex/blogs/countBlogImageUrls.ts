import type { Doc } from "../_generated/dataModel";

export const countBlogImageUrls = (blog: Doc<"blogs">) => {
  const imageUrls = new Set(
    [blog.featureImageUrl, ...blog.images.map((image) => image.url)].filter(
      Boolean,
    ),
  );

  return imageUrls.size;
};
