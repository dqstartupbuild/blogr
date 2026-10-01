import { storeGeneratedBlogImage } from "./storeGeneratedBlogImage";
import type { BlogImage } from "./types/BlogImage";

type StoreGeneratedBlogImagesOptions = {
  images: BlogImage[];
};

export const storeGeneratedBlogImages = async ({
  images,
}: StoreGeneratedBlogImagesOptions) => {
  const storedImages: BlogImage[] = [];

  for (const image of images) {
    storedImages.push(await storeGeneratedBlogImage({ image }));
  }

  return storedImages;
};
