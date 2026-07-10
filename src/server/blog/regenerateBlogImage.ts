import { runReplicateImage } from "../replicate/runReplicateImage";
import { storeGeneratedBlogImage } from "./storeGeneratedBlogImage";
import type { BlogImage } from "./types/BlogImage";

type RegenerateBlogImageOptions = {
  alt: string;
  prompt: string;
  sectionHeading?: string;
  token?: string;
  userId?: string;
};

export const regenerateBlogImage = async ({
  alt,
  prompt,
  sectionHeading,
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
    image: { alt, prompt, sectionHeading, url },
    token,
    userId,
  });
};
