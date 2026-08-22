import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { isUsefulTopicExpansionPhrase } from "./isUsefulTopicExpansionPhrase";
import { normalizeTopicExpansionPhrase } from "./normalizeTopicExpansionPhrase";
import { splitTopicExpansionPhrases } from "./splitTopicExpansionPhrases";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

export const buildTopicExpansionBasePhrases = (
  product: TopicDiscoveryProduct,
) => {
  const productName = product.name.trim();
  const niche = product.niche.trim();
  const productNiche = productName && niche ? `${productName} ${niche}` : "";
  const activeSiteLinks = product.siteLinks?.filter(
    (link) => link.isActive !== false,
  );

  return dedupeTopicStrings(
    [
      niche,
      productNiche,
      productName,
      ...splitTopicExpansionPhrases(product.description),
      ...splitTopicExpansionPhrases(product.rawContext || ""),
      ...(activeSiteLinks || []).map((link) => link.title),
    ]
      .map(normalizeTopicExpansionPhrase)
      .filter(isUsefulTopicExpansionPhrase),
  ).slice(0, 12);
};
