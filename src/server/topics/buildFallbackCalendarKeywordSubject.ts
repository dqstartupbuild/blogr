import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

export const buildFallbackCalendarKeywordSubject = (
  product: TopicDiscoveryProduct,
) => {
  const niche = product.niche
    .split(/\b(?:for|who|that|which)\b/i)[0]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 6)
    .join(" ");

  return niche || product.name.trim() || "online product";
};
