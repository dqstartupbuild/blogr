import { storeGeneratedBlogImage } from "./storeGeneratedBlogImage";
import type { BlogImage } from "./types/BlogImage";

type StoreGeneratedBlogImagesOptions = {
  images: BlogImage[];
  token?: string;
  userId?: string;
};

export const storeGeneratedBlogImages = async ({
  images,
  token,
  userId,
}: StoreGeneratedBlogImagesOptions) => {
  const storedImages: BlogImage[] = [];

  for (const image of images) {
    storedImages.push(await storeGeneratedBlogImage({ image, token, userId }));
  }

  return storedImages;
};
