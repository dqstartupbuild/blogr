import { tryGenerateBlogImage } from "./tryGenerateBlogImage";
import type { BlogImagePrompt } from "./types/BlogImagePrompt";
import type { BlogImage } from "./types/BlogImage";

type GenerateBlogImagesOptions = {
  prompts: BlogImagePrompt[];
};

export const generateBlogImages = async ({
  prompts,
}: GenerateBlogImagesOptions): Promise<BlogImage[]> => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return [];
  }

  const images: Array<BlogImage | null> = [];

  for (const prompt of prompts) {
    images.push(await tryGenerateBlogImage(prompt));
  }

  return images.filter((image): image is BlogImage => Boolean(image));
};
