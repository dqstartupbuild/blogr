import { buildTopicIntentKey } from "./buildTopicIntentKey";
import { mergeTopicCandidateNotes } from "./mergeTopicCandidateNotes";
import { selectBestTopicCandidate } from "./selectBestTopicCandidate";
import type { TopicCandidate } from "./types/TopicCandidate";

export const mergeTopicCandidateGroup = (
  candidates: TopicCandidate[],
): TopicCandidate => {
  const bestCandidate = selectBestTopicCandidate(candidates);
  const canonicalKeyword = bestCandidate.canonicalKeyword;

  return {
    ...bestCandidate,
    canonicalKeyword,
    intentKey:
      bestCandidate.intentKey ||
      buildTopicIntentKey(canonicalKeyword) ||
      canonicalKeyword.toLowerCase(),
    keyword: canonicalKeyword,
    notes: mergeTopicCandidateNotes(candidates),
    sourceSignals: Array.from(
      new Set(candidates.flatMap((candidate) => candidate.sourceSignals)),
    ).slice(0, 10),
  };
};
