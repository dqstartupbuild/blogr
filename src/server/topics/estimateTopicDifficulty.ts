import { getSerpDomain } from "./getSerpDomain";
import type { SerpSignal } from "./types/SerpSignal";

const strongDomains = [
  "amazon.com",
  "forbes.com",
  "g2.com",
  "hubspot.com",
  "linkedin.com",
  "medium.com",
  "nytimes.com",
  "pcmag.com",
  "reddit.com",
  "techcrunch.com",
  "wikipedia.org",
  "youtube.com",
];

export const estimateTopicDifficulty = (
  title: string,
  signals: SerpSignal[],
): "low" | "medium" | "high" => {
  const titleWords = title.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingResults = signals.flatMap((signal) =>
    signal.organicResults.filter((result) => {
      const haystack = `${result.title} ${result.description}`.toLowerCase();

      return titleWords.some((word) => word.length > 4 && haystack.includes(word));
    }),
  );
  const strongResultCount = matchingResults.filter((result) =>
    strongDomains.includes(getSerpDomain(result.url)),
  ).length;

  if (strongResultCount >= 3) return "high";
  if (strongResultCount >= 1 || matchingResults.length >= 6) return "medium";

  return "low";
};
