import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { SerpSignal } from "./types/SerpSignal";

export const buildSerpSourceLinks = (signals: SerpSignal[]): LinkItem[] => {
  return signals
    .flatMap((signal) => signal.organicResults)
    .filter((result) => result.title && result.url)
    .map((result) => ({
      reason: result.description,
      title: result.title,
      url: result.url,
    }))
    .slice(0, 8);
};
