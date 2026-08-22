import type { TopicSourceType } from "@/features/workspace/types/TopicSourceType";

const sourcePriority: Record<TopicSourceType, number> = {
  aeo: 3,
  cluster: 1,
  comparison: 8,
  difficulty: 4,
  discovery: 10,
  gap: 9,
  manual: 6,
  question: 7,
  refresh: 2,
};

export const getTopicCandidatePriority = (sourceType: TopicSourceType) => {
  return sourcePriority[sourceType] || 0;
};
