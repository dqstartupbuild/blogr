import { createReplicateClient } from "./createReplicateClient";
import { normalizeReplicateImageUrl } from "./normalizeReplicateImageUrl";
import type { ReplicateModelSlug } from "./types/ReplicateModelSlug";

export const runReplicateImage = async (prompt: string) => {
  const replicate = createReplicateClient();
  const model = (process.env.REPLICATE_IMAGE_MODEL ||
    "google/nano-banana-2") as ReplicateModelSlug;
  const output = await replicate.run(model, {
    input: {
      aspect_ratio: "16:9",
      output_format: "png",
      prompt,
    },
  });

  return normalizeReplicateImageUrl(output);
};
