import { runReplicateText } from "../replicate/runReplicateText";
import { buildCalendarKeywordSuggestionPrompt } from "./buildCalendarKeywordSuggestionPrompt";
import { createCalendarKeywordCandidate } from "./createCalendarKeywordCandidate";
import { parseCalendarKeywordSuggestions } from "./parseCalendarKeywordSuggestions";
import type { TopicCandidate } from "./types/TopicCandidate";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type GenerateAiCalendarKeywordCandidatesOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  product: TopicDiscoveryProduct;
  requestedCount: number;
};

export const generateAiCalendarKeywordCandidates = async ({
  existingBlogs,
  existingTopics,
  product,
  requestedCount,
}: GenerateAiCalendarKeywordCandidatesOptions): Promise<TopicCandidate[]> => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return [];
  }

  const targetCount = Math.min(90, Math.max(30, requestedCount * 3));
  const text = await runReplicateText({
    maxTokens: Math.min(8000, Math.max(4000, targetCount * 90)),
    prompt: buildCalendarKeywordSuggestionPrompt({
      existingBlogs,
      existingTopics,
      product,
      targetCount,
    }),
    systemPrompt:
      "You create concise, varied, natural-language SEO keyword candidates from product context. You never invent metrics or search evidence. Return JSON only.",
  });
  const candidates: TopicCandidate[] = [];

  parseCalendarKeywordSuggestions(text).forEach((suggestion) => {
    const candidate = createCalendarKeywordCandidate(suggestion);

    if (candidate) {
      candidates.push(candidate);
    }
  });

  return candidates;
};
