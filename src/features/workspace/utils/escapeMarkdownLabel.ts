export const escapeMarkdownLabel = (label: string) => {
  return label.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
};
