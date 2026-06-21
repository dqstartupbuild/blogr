export const escapeMarkdownLinkLabel = (label: string) => {
  return label.replace(/[[\]]/g, "");
};
