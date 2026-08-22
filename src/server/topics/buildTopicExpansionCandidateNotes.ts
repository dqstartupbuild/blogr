import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";
import type { TopicExpansionPattern } from "./types/TopicExpansionPattern";

type BuildTopicExpansionCandidateNotesOptions = {
  base: string;
  pattern: TopicExpansionPattern;
  product: TopicDiscoveryProduct;
  scope: string;
};

export const buildTopicExpansionCandidateNotes = ({
  base,
  pattern,
  product,
  scope,
}: BuildTopicExpansionCandidateNotesOptions) => {
  const productFocus = product.name.trim() || product.niche.trim() || base;

  return [
    pattern.notes,
    pattern.intent,
    `Keep the article focused on ${productFocus}.`,
    `Write it for ${scope}.`,
  ].join("\n");
};
