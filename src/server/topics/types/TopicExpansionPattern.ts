import type { TopicSourceType } from "@/features/workspace/types/TopicSourceType";

export type TopicExpansionPattern = {
  intent: string;
  notes: string;
  sourceType: TopicSourceType;
  template: string;
};
