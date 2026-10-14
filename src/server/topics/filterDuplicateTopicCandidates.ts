import { buildTopicIntentKey } from "./buildTopicIntentKey";
import { calculateTopicSimilarity } from "./calculateTopicSimilarity";
import type { TopicCandidate } from "./types/TopicCandidate";

type ExistingTopicLike = {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
};

export const filterDuplicateTopicCandidates = (
  candidates: TopicCandidate[],
  existingTopics: ExistingTopicLike[],
) => {
  const existingKeywords = existingTopics.flatMap((topic) => [
    topic.keyword,
    topic.canonicalKeyword || "",
  ]);
  const existingIntentKeys = new Set(
    existingTopics.flatMap((topic) => [
      topic.intentKey || "",
      buildTopicIntentKey(topic.canonicalKeyword || topic.keyword),
    ]),
  );

  return candidates.filter((candidate) => {
    if (existingIntentKeys.has(candidate.intentKey)) {
      return false;
    }

    return !existingKeywords.some(
      (keyword) =>
        keyword &&
        calculateTopicSimilarity(keyword, candidate.canonicalKeyword) >= 0.72,
    );
  });
};
