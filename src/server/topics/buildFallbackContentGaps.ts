import { getSerpDomain } from "./getSerpDomain";
import type { TopicDiscoveryContentGap } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryContentGap";
import type { SerpSignal } from "./types/SerpSignal";

export const buildFallbackContentGaps = (
  signals: SerpSignal[],
): TopicDiscoveryContentGap[] => {
  return signals
    .flatMap((signal) =>
      signal.organicResults.slice(0, 3).map((result) => ({
        reason:
          "This ranking page gives a useful angle, but your post can make it more specific to your reader.",
        source: getSerpDomain(result.url) || result.displayedUrl || result.url,
        title: result.title,
      })),
    )
    .slice(0, 8);
};
