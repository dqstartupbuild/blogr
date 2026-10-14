export const stripMarkdownCodeFence = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json|xml|mdx|markdown)?\s*([\s\S]*?)\s*```$/i);

  return match?.[1]?.trim() || trimmed;
};
