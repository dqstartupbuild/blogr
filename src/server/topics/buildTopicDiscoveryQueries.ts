import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { normalizeTopicDiscoveryQuery } from "./normalizeTopicDiscoveryQuery";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildTopicDiscoveryQueriesOptions = {
  product: TopicDiscoveryProduct;
  seedKeyword?: string;
};

export const buildTopicDiscoveryQueries = ({
  product,
  seedKeyword,
}: BuildTopicDiscoveryQueriesOptions) => {
  const seed = seedKeyword?.trim();
  const niche = product.niche.trim();
  const audience = product.audience.trim();
  const productName = product.name.trim();
  const baseTopic = seed || niche || product.description.trim() || productName;
  const audienceSuffix = audience ? ` for ${audience}` : "";
  const productQueries = productName
    ? [`${productName} alternatives`, `${productName} vs competitors`]
    : [];

  return dedupeTopicStrings(
    [
      baseTopic,
      `${baseTopic}${audienceSuffix}`,
      `best ${baseTopic}`,
      `${baseTopic} questions`,
      `${baseTopic} alternatives`,
      `${baseTopic} vs`,
      ...productQueries,
    ].map(normalizeTopicDiscoveryQuery),
  ).slice(0, 6);
};
