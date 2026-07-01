import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { normalizeTopicDiscoveryQuery } from "./normalizeTopicDiscoveryQuery";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildTopicBatchDiscoveryQueriesOptions = {
  product: TopicDiscoveryProduct;
};

export const buildTopicBatchDiscoveryQueries = ({
  product,
}: BuildTopicBatchDiscoveryQueriesOptions) => {
  const niche = product.niche.trim();
  const audience = product.audience.trim();
  const productName = product.name.trim();
  const baseTopic = niche || product.description.trim() || productName;
  const audienceSuffix = audience ? ` for ${audience}` : "";

  return dedupeTopicStrings(
    [
      baseTopic,
      `${baseTopic}${audienceSuffix}`,
      `${baseTopic} questions`,
      `${baseTopic} examples`,
      `${baseTopic} mistakes`,
      `${baseTopic} checklist`,
      `${baseTopic} alternatives`,
      `${baseTopic} vs`,
      productName ? `${productName} alternatives` : "",
      productName ? `${productName} vs competitors` : "",
    ].map(normalizeTopicDiscoveryQuery),
  ).slice(0, 6);
};
