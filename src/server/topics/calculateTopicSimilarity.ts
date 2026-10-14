import { tokenizeTopicIntent } from "./tokenizeTopicIntent";

export const calculateTopicSimilarity = (left: string, right: string) => {
  const leftTokens = new Set(tokenizeTopicIntent(left));
  const rightTokens = new Set(tokenizeTopicIntent(right));

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  const sharedCount = Array.from(leftTokens).filter((token) =>
    rightTokens.has(token),
  ).length;
  const unionCount = new Set([...leftTokens, ...rightTokens]).size;

  return sharedCount / unionCount;
};
