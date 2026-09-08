import { runReplicateImage } from "../replicate/runReplicateImage";
import type { BlogImage } from "./types/BlogImage";
import type { BlogImagePrompt } from "./types/BlogImagePrompt";

export const tryGenerateBlogImage = async (
  image: BlogImagePrompt,
): Promise<BlogImage | null> => {
  try {
    const url = await runReplicateImage(image.prompt);

    if (!url) {
      console.warn("Blog image generation returned no image URL.");
      return null;
    }

    return { ...image, url };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn("Blog image generation failed.", errorName);

    return null;
  }
};
