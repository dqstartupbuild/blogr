import { collectSerpOrganicTitles } from "./collectSerpOrganicTitles";
import { collectSerpRelatedSearches } from "./collectSerpRelatedSearches";
import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { isComparisonTopic } from "./isComparisonTopic";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildFallbackComparisonTopicsOptions = {
  product: TopicDiscoveryProduct;
  signals: SerpSignal[];
};

export const buildFallbackComparisonTopics = ({
  product,
  signals,
}: BuildFallbackComparisonTopicsOptions) => {
  const niche = product.niche.trim();
  const productName = product.name.trim();
  const generatedTopics = [
    niche ? `Best ${niche} options for ${product.audience || "busy teams"}` : "",
    productName ? `${productName} alternatives` : "",
    productName ? `${productName} vs competitors` : "",
  ];

  return dedupeTopicStrings([
    ...collectSerpRelatedSearches(signals).filter(isComparisonTopic),
    ...collectSerpOrganicTitles(signals).filter(isComparisonTopic),
    ...generatedTopics,
  ]).slice(0, 8);
};
