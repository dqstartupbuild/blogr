import type { TopicSourceType } from "@/features/workspace/types/TopicSourceType";

export type TopicCandidate = {
  canonicalKeyword: string;
  difficulty?: "low" | "medium" | "high";
  intent?: string;
  intentKey: string;
  keyword: string;
  notes: string;
  sourceSignals: string[];
  sourceType: TopicSourceType;
};
