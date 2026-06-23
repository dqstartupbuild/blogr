import { dedupeTopicStrings } from "./dedupeTopicStrings";
import type { SerpSignal } from "./types/SerpSignal";

export const collectSerpRelatedSearches = (signals: SerpSignal[]) => {
  return dedupeTopicStrings(
    signals.flatMap((signal) => signal.relatedSearches),
  ).slice(0, 16);
};
