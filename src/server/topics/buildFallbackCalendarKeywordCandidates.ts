import { buildFallbackCalendarKeywordSubject } from "./buildFallbackCalendarKeywordSubject";
import { createCalendarKeywordCandidate } from "./createCalendarKeywordCandidate";
import { fallbackCalendarKeywordTemplates } from "./fallbackCalendarKeywordTemplates";
import type { TopicCandidate } from "./types/TopicCandidate";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

export const buildFallbackCalendarKeywordCandidates = (
  product: TopicDiscoveryProduct,
) => {
  const subject = buildFallbackCalendarKeywordSubject(product);
  const candidates: TopicCandidate[] = [];

  fallbackCalendarKeywordTemplates.forEach((template) => {
    const keyword = template.replaceAll("{subject}", subject);
    const candidate = createCalendarKeywordCandidate({
      keyword,
      readerNeed: `Learn about ${subject} in a practical way.`,
      reason: `This gives ${product.name || "the product"} a relevant topic when AI keyword generation is unavailable.`,
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  return candidates;
};
