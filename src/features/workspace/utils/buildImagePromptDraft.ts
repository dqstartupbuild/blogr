type BuildImagePromptDraftOptions = {
  alt: string;
  prompt?: string;
};

export const buildImagePromptDraft = ({
  alt,
  prompt,
}: BuildImagePromptDraftOptions) => {
  const trimmedPrompt = prompt?.trim();

  if (trimmedPrompt) {
    return trimmedPrompt;
  }

  const trimmedAlt = alt.trim();

  return trimmedAlt
    ? `Create a clear, on-topic blog image showing: ${trimmedAlt}`
    : "";
};
