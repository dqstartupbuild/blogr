import { buildFallbackCalendarKeywordCandidates } from "./buildFallbackCalendarKeywordCandidates";
import { buildUniqueTopicCandidates } from "./buildUniqueTopicCandidates";
import { filterExactDuplicateCalendarCandidates } from "./filterExactDuplicateCalendarCandidates";
import { generateAiCalendarKeywordCandidates } from "./generateAiCalendarKeywordCandidates";
import { researchCalendarKeywordCandidates } from "./researchCalendarKeywordCandidates";
import type { TopicCandidate } from "./types/TopicCandidate";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type ExistingTopic = {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
};

type SelectNewTopicCandidatesOptions = {
  count: number;
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: ExistingTopic[];
  product: TopicDiscoveryProduct;
};

// Shared by calendar AI fill and Topics "Find ideas": asks the AI for keyword
// ideas, drops anything already covered, tops up with fallbacks, then researches.
export const selectNewTopicCandidates = async ({
  count,
  existingBlogs,
  existingTopics,
  product,
}: SelectNewTopicCandidatesOptions): Promise<TopicCandidate[]> => {
  if (count <= 0) {
    return [];
  }

  const existingBlogTopics = existingBlogs
    .map((blog) => ({ keyword: blog.keyword || blog.title }))
    .filter((blog) => blog.keyword.trim());
  const existingItems = [...existingTopics, ...existingBlogTopics];
  let aiCandidates: TopicCandidate[] = [];

  try {
    aiCandidates = await generateAiCalendarKeywordCandidates({
      existingBlogs,
      existingTopics: existingTopics.map((topic) => topic.keyword),
      product,
      requestedCount: count,
    });
  } catch {
    aiCandidates = [];
  }

  const uniqueCandidates = buildUniqueTopicCandidates({
    candidates: aiCandidates,
    existingTopics: existingItems,
  });

  if (uniqueCandidates.length < count) {
    const fallbackCandidates = filterExactDuplicateCalendarCandidates(
      buildFallbackCalendarKeywordCandidates(product),
      [...existingItems, ...uniqueCandidates],
    );

    uniqueCandidates.push(...fallbackCandidates);
  }

  return researchCalendarKeywordCandidates(uniqueCandidates.slice(0, count));
};
