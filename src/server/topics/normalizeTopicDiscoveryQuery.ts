export const normalizeTopicDiscoveryQuery = (query: string) => {
  return query
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .slice(0, 32)
    .join(" ");
};
