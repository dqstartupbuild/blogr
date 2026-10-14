import { createReplicateClient } from "./createReplicateClient";
import { normalizeReplicateTextOutput } from "./normalizeReplicateTextOutput";
import type { ReplicateModelSlug } from "./types/ReplicateModelSlug";

type RunReplicateTextOptions = {
  maxTokens?: number;
  prompt: string;
  systemPrompt?: string;
};

export const runReplicateText = async ({
  maxTokens = 1600,
  prompt,
  systemPrompt,
}: RunReplicateTextOptions) => {
  const replicate = createReplicateClient();
  const model = (process.env.REPLICATE_WRITER_MODEL ||
    "anthropic/claude-sonnet-4.6") as ReplicateModelSlug;
  const output = await replicate.run(model, {
    input: {
      max_tokens: maxTokens,
      prompt,
      system_prompt: systemPrompt,
      temperature: 0.2,
    },
  });

  return normalizeReplicateTextOutput(output);
};
