export const normalizeTopicKeyword = (keyword: string) => {
  return keyword
    .replace(/^\s*cover\s+this\s+gap\s*:?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
};
