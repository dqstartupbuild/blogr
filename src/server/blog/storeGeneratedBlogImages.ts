import { storeGeneratedBlogImage } from "./storeGeneratedBlogImage";
import type { BlogImage } from "./types/BlogImage";

type StoreGeneratedBlogImagesOptions = {
  images: BlogImage[];
  token?: string;
};

export const storeGeneratedBlogImages = async ({
  images,
  token,
}: StoreGeneratedBlogImagesOptions) => {
  const storedImages: BlogImage[] = [];

  for (const image of images) {
    storedImages.push(await storeGeneratedBlogImage({ image, token }));
  }

  return storedImages;
};
