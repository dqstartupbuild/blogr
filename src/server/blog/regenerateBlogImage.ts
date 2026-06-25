import { runReplicateImage } from "../replicate/runReplicateImage";
import { storeGeneratedBlogImage } from "./storeGeneratedBlogImage";
import type { BlogImage } from "./types/BlogImage";

type RegenerateBlogImageOptions = {
  alt: string;
  prompt: string;
  token?: string;
  userId?: string;
};

export const regenerateBlogImage = async ({
  alt,
  prompt,
  token,
  userId,
}: RegenerateBlogImageOptions): Promise<BlogImage | null> => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return null;
  }

  const url = await runReplicateImage(prompt);

  if (!url) {
    return null;
  }

  return await storeGeneratedBlogImage({
    image: { alt, prompt, url },
    token,
    userId,
  });
};