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
  return await Promise.all(
    images.map((image) => storeGeneratedBlogImage({ image, token })),
  );
};
