export const normalizeTopicIntentToken = (token: string) => {
  const normalized = token.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (normalized.length > 4 && normalized.endsWith("s")) {
    return normalized.slice(0, -1);
  }

  return normalized;
};
