import { runReplicateImage } from "../replicate/runReplicateImage";
import type { BlogImage } from "./types/BlogImage";
import type { BlogImagePrompt } from "./types/BlogImagePrompt";

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
