import { storeImageUrlWithConvexR2 } from "../r2/storeImageUrlWithConvexR2";
import type { BlogImage } from "./types/BlogImage";

type StoreGeneratedBlogImageOptions = {
  image: BlogImage;
  token?: string;
  userId?: string;
};

export const storeGeneratedBlogImage = async ({
  image,
  token,
  userId,
}: StoreGeneratedBlogImageOptions): Promise<BlogImage> => {
  const storedImage = await storeImageUrlWithConvexR2({
    category: "blog-images",
    filenameHint: image.alt,
    token,
    url: image.url,
    userId,
  });

  if (!storedImage) {
    return image;
  }

  return {
    ...image,
    r2Key: storedImage.key,
    url: storedImage.url,
  };
};
