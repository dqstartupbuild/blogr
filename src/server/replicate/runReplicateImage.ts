import { createReplicateClient } from "./createReplicateClient";
import { createRetryingReplicateImageFetch } from "./createRetryingReplicateImageFetch";
import { normalizeReplicateImageUrl } from "./normalizeReplicateImageUrl";
import type { ReplicateModelSlug } from "./types/ReplicateModelSlug";

export const runReplicateImage = async (prompt: string) => {
  const replicate = createReplicateClient();
  replicate.fetch = createRetryingReplicateImageFetch({
    fetch: replicate.fetch,
  }) as unknown as typeof replicate.fetch;
  const model = (process.env.REPLICATE_IMAGE_MODEL ||
    "google/nano-banana-2") as ReplicateModelSlug;
  const output = await replicate.run(model, {
    input: {
      aspect_ratio: "16:9",
      output_format: "png",
      prompt,
    },
    wait: { mode: "poll" },
  });

  return normalizeReplicateImageUrl(output);
};
