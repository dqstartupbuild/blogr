import { getReplicateImageFailureDiagnostics } from "../replicate/getReplicateImageFailureDiagnostics";
import { runReplicateImage } from "../replicate/runReplicateImage";
import type { BlogImage } from "./types/BlogImage";
import type { BlogImagePrompt } from "./types/BlogImagePrompt";

export const tryGenerateBlogImage = async (
  image: BlogImagePrompt,
): Promise<BlogImage | null> => {
  try {
    const url = await runReplicateImage(image.prompt);

    if (!url) {
      console.warn(
        "Blog image generation returned no image URL.",
        getReplicateImageFailureDiagnostics({ stage: "missing-output" }),
      );
      return null;
    }

    return { ...image, url };
  } catch (error) {
    console.warn(
      "Blog image generation failed.",
      getReplicateImageFailureDiagnostics({ error, stage: "prediction" }),
    );

    return null;
  }
};
