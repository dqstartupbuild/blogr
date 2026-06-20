import { runReplicateImage } from "../replicate/runReplicateImage";
import { buildImagePrompts } from "./buildImagePrompts";
import type { BlogImage } from "./types/BlogImage";
import type { StoredProduct } from "./types/StoredProduct";

type GenerateBlogImagesOptions = {
  keyword: string;
  product: StoredProduct;
};

export const generateBlogImages = async ({
  keyword,
  product,
}: GenerateBlogImagesOptions): Promise<BlogImage[]> => {
  const prompts = buildImagePrompts({ keyword, product });

  if (!process.env.REPLICATE_API_TOKEN) {
    return [];
  }

  const images = await Promise.all(
    prompts.map(async (image) => ({
      ...image,
      url: await runReplicateImage(image.prompt),
    })),
  );

  return images.filter((image) => image.url);
};
