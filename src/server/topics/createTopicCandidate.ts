import { buildTopicCandidateIntentKey } from "./buildTopicCandidateIntentKey";
import { normalizeCanonicalKeyword } from "./normalizeCanonicalKeyword";
import type { TopicSourceType } from "@/features/workspace/types/TopicSourceType";
import type { TopicCandidate } from "./types/TopicCandidate";

type CreateTopicCandidateOptions = {
  difficulty?: TopicCandidate["difficulty"];
  intent?: string;
  keyword: string;
  notes: string;
  sourceSignals?: string[];
  sourceType: TopicSourceType;
};

export const createTopicCandidate = ({
  difficulty,
  intent,
  keyword,
  notes,
  sourceSignals = [],
  sourceType,
}: CreateTopicCandidateOptions): TopicCandidate | null => {
  const canonicalKeyword = normalizeCanonicalKeyword(keyword);

  if (!canonicalKeyword) {
    return null;
  }

  return {
    canonicalKeyword,
    difficulty,
    intent,
    intentKey: buildTopicCandidateIntentKey(canonicalKeyword),
    keyword: canonicalKeyword,
    notes,
    sourceSignals,
    sourceType,
  };
};
