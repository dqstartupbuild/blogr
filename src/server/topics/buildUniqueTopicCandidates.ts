import { filterDuplicateTopicCandidates } from "./filterDuplicateTopicCandidates";
import { groupTopicCandidates } from "./groupTopicCandidates";
import { mergeTopicCandidateGroup } from "./mergeTopicCandidateGroup";
import type { TopicCandidate } from "./types/TopicCandidate";

type ExistingTopicLike = {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
};

export const buildUniqueTopicCandidates = ({
  candidates,
  existingTopics,
}: {
  candidates: TopicCandidate[];
  existingTopics: ExistingTopicLike[];
}) => {
  const mergedCandidates = groupTopicCandidates(candidates).map(
    mergeTopicCandidateGroup,
  );

  return filterDuplicateTopicCandidates(mergedCandidates, existingTopics);
};
