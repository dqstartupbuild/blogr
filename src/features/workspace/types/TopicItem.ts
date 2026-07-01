import type { TopicSourceType } from "./TopicSourceType";

export type TopicItem = {
  canonicalKeyword?: string;
  id: string;
  intentKey?: string;
  keyword: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?: TopicSourceType;
  status: "saved" | "writing" | "written" | "failed";
  blogId?: string;
};
