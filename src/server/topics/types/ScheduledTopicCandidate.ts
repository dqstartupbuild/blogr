import type { TopicSourceType } from "@/features/workspace/types/TopicSourceType";

export type ScheduledTopicCandidate = {
  canonicalKeyword: string;
  intentKey: string;
  keyword: string;
  notes: string;
  scheduledDate: string;
  sourceType: TopicSourceType;
};
