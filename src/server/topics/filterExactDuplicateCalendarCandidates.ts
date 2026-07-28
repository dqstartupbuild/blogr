import { buildTopicIntentKey } from "./buildTopicIntentKey";
import type { TopicCandidate } from "./types/TopicCandidate";

type ExistingTopicLike = {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
};

export const filterExactDuplicateCalendarCandidates = (
  candidates: TopicCandidate[],
  existingTopics: ExistingTopicLike[],
) => {
  const existingKeys = new Set(
    existingTopics.flatMap((topic) => [
      topic.keyword.trim().toLowerCase(),
      topic.canonicalKeyword?.trim().toLowerCase() || "",
      topic.intentKey || buildTopicIntentKey(topic.canonicalKeyword || topic.keyword),
    ]),
  );

  return candidates.filter((candidate) => {
    const candidateKeys = [
      candidate.keyword.trim().toLowerCase(),
      candidate.canonicalKeyword.trim().toLowerCase(),
      candidate.intentKey,
    ];

    if (candidateKeys.some((key) => existingKeys.has(key))) {
      return false;
    }

    candidateKeys.forEach((key) => existingKeys.add(key));
    return true;
  });
};
