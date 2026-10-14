export const estimateReadTimeMinutes = (wordCount: number) => {
  return Math.max(1, Math.ceil(wordCount / 225));
};
