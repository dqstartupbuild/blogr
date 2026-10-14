import { createReplicateClient } from "./createReplicateClient";
import { getReplicateImagePlannerModel } from "./getReplicateImagePlannerModel";
import { normalizeReplicateTextOutput } from "./normalizeReplicateTextOutput";

type RunReplicateImagePlannerTextOptions = {
  maxTokens?: number;
  prompt: string;
  systemPrompt?: string;
};

export const runReplicateImagePlannerText = async ({
  maxTokens = 2200,
  prompt,
  systemPrompt,
}: RunReplicateImagePlannerTextOptions) => {
  const replicate = createReplicateClient();
  const output = await replicate.run(getReplicateImagePlannerModel(), {
    input: {
      max_tokens: maxTokens,
      prompt,
      system_prompt: systemPrompt,
      temperature: 0.1,
    },
  });

  return normalizeReplicateTextOutput(output);
};
