import { buildImagePrompts } from "./buildImagePrompts";
import { tryGenerateBlogImage } from "./tryGenerateBlogImage";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { BlogImage } from "./types/BlogImage";
import type { StoredProduct } from "./types/StoredProduct";

type GenerateBlogImagesOptions = {
  keyword: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
};

export const generateBlogImages = async ({
  keyword,
  product,
  settings,
}: GenerateBlogImagesOptions): Promise<BlogImage[]> => {
  const prompts = buildImagePrompts({ keyword, product, settings });

  if (!process.env.REPLICATE_API_TOKEN) {
    return [];
  }

  const images: Array<BlogImage | null> = [];

  for (const prompt of prompts) {
    images.push(await tryGenerateBlogImage(prompt));
  }

  return images.filter((image): image is BlogImage => Boolean(image));
};
