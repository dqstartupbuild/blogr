import { dedupeTopicStrings } from "./dedupeTopicStrings";
import type { SerpSignal } from "./types/SerpSignal";

export const collectSerpQuestions = (signals: SerpSignal[]) => {
  return dedupeTopicStrings(
    signals.flatMap((signal) => signal.peopleAlsoAsk),
  ).slice(0, 16);
};
