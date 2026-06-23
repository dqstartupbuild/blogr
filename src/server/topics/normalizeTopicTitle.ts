export const normalizeTopicTitle = (title: string) => {
  return title
    .replace(/\s*\|.*$/g, "")
    .replace(/\s+-\s+.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
