import { runReplicateImage } from "../replicate/runReplicateImage";
import type { BlogImage } from "./types/BlogImage";

type BlogImagePrompt = Omit<BlogImage, "url">;

export const tryGenerateBlogImage = async (
  image: BlogImagePrompt,
): Promise<BlogImage | null> => {
  try {
    const url = await runReplicateImage(image.prompt);

    return url ? { ...image, url } : null;
  } catch {
    return null;
  }
};
