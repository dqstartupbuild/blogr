import type { TopicSourceType } from "../TopicSourceType";

export type CalendarBatchTopic = {
  canonicalKeyword: string;
  intentKey: string;
  keyword: string;
  notes: string;
  scheduledDate: string;
  sourceType: TopicSourceType;
};
