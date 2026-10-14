import { calculateTopicSimilarity } from "./calculateTopicSimilarity";
import type { TopicCandidate } from "./types/TopicCandidate";

export const areTopicCandidatesSimilar = (
  left: TopicCandidate,
  right: TopicCandidate,
) => {
  if (left.intentKey && left.intentKey === right.intentKey) {
    return true;
  }

  return calculateTopicSimilarity(left.canonicalKeyword, right.canonicalKeyword) >= 0.67;
};
