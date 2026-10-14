import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { normalizeTopicTitle } from "./normalizeTopicTitle";
import type { SerpSignal } from "./types/SerpSignal";

export const collectSerpOrganicTitles = (signals: SerpSignal[]) => {
  return dedupeTopicStrings(
    signals.flatMap((signal) =>
      signal.organicResults.map((result) => normalizeTopicTitle(result.title)),
    ),
  ).slice(0, 16);
};
