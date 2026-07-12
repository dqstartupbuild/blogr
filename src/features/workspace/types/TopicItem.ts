import type { TopicSourceType } from "./TopicSourceType";

export type TopicItem = {
  canonicalKeyword?: string;
  createdAt?: number;
  id: string;
  intentKey?: string;
  keyword: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?: TopicSourceType;
  status:
    | "saved"
    | "scheduled"
    | "writing"
    | "written"
    | "published"
    | "failed";
  blogId?: string;
  updatedAt?: number;
};
