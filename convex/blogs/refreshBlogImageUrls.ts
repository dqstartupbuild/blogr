import type { Doc } from "../_generated/dataModel";
import { getR2ImageUrl } from "../r2/getR2ImageUrl";

export const refreshBlogImageUrls = async (blog: Doc<"blogs">) => {
  const refreshedImages = await Promise.all(
    blog.images.map(async (image) => {
      if (!image.r2Key) {
        return image;
      }

      const freshUrl = await getR2ImageUrl(image.r2Key).catch(() => image.url);

      return {
        ...image,
        url: freshUrl,
      };
    }),
  );
  const refreshedFeatureImageUrl =
    refreshedImages[0]?.url || blog.featureImageUrl;
  const refreshedMdx = blog.images.reduce((current, image, index) => {
    const freshUrl = refreshedImages[index]?.url;

    if (!image.url || !freshUrl || image.url === freshUrl) {
      return current;
    }

    return current.split(image.url).join(freshUrl);
  }, blog.mdx);

  return {
    ...blog,
    featureImageUrl: refreshedFeatureImageUrl,
    images: refreshedImages,
    mdx: refreshedMdx,
  };
};
