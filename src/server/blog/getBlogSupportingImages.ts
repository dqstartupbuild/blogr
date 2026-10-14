import { getBlogFeatureImage } from "./getBlogFeatureImage";
import type { BlogImage } from "./types/BlogImage";

export const getBlogSupportingImages = (images: BlogImage[]) => {
  const featureImage = getBlogFeatureImage(images);

  return images.filter((image) => image !== featureImage);
};
