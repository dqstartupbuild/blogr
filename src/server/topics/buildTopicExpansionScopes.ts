import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { isUsefulTopicExpansionPhrase } from "./isUsefulTopicExpansionPhrase";
import { normalizeTopicExpansionPhrase } from "./normalizeTopicExpansionPhrase";
import { splitTopicExpansionPhrases } from "./splitTopicExpansionPhrases";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

const defaultTopicExpansionScopes = [
  "beginners",
  "new users",
  "busy teams",
  "growing teams",
  "small businesses",
  "first-time buyers",
  "decision makers",
  "lean teams",
  "manual workflows",
  "weekly planning",
  "budget reviews",
  "customer questions",
  "team training",
  "quick wins",
];

export const buildTopicExpansionScopes = (product: TopicDiscoveryProduct) => {
  return dedupeTopicStrings(
    [
      ...splitTopicExpansionPhrases(product.audience),
      ...defaultTopicExpansionScopes,
    ]
      .map(normalizeTopicExpansionPhrase)
      .filter(isUsefulTopicExpansionPhrase),
  ).slice(0, 16);
};
