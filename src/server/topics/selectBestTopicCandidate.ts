import { getTopicCandidatePriority } from "./getTopicCandidatePriority";
import type { TopicCandidate } from "./types/TopicCandidate";

export const selectBestTopicCandidate = (candidates: TopicCandidate[]) => {
  return candidates.reduce((best, candidate) => {
    const priorityDelta =
      getTopicCandidatePriority(candidate.sourceType) -
      getTopicCandidatePriority(best.sourceType);

    if (priorityDelta !== 0) {
      return priorityDelta > 0 ? candidate : best;
    }

    return candidate.canonicalKeyword.length < best.canonicalKeyword.length
      ? candidate
      : best;
  }, candidates[0]);
};
