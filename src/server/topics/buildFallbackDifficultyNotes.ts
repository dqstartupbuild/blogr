import { getSerpDomain } from "./getSerpDomain";
import type { TopicDiscoveryDifficultyNote } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryDifficultyNote";
import type { SerpSignal } from "./types/SerpSignal";

export const buildFallbackDifficultyNotes = (
  signals: SerpSignal[],
): TopicDiscoveryDifficultyNote[] => {
  return signals.map((signal) => {
    const domains = signal.organicResults
      .map((result) => getSerpDomain(result.url))
      .filter(Boolean);
    const uniqueDomains = Array.from(new Set(domains));
    const level = uniqueDomains.length >= 8 ? "high" : "medium";

    return {
      level,
      query: signal.query,
      reason:
        level === "high"
          ? "The results are spread across many established sites."
          : "There is room for a focused post with better examples.",
    };
  });
};
