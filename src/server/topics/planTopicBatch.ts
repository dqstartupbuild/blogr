import { assignTopicCandidatesToDates } from "./assignTopicCandidatesToDates";
import { buildFallbackCalendarKeywordCandidates } from "./buildFallbackCalendarKeywordCandidates";
import { buildUniqueTopicCandidates } from "./buildUniqueTopicCandidates";
import { filterExactDuplicateCalendarCandidates } from "./filterExactDuplicateCalendarCandidates";
import { generateAiCalendarKeywordCandidates } from "./generateAiCalendarKeywordCandidates";
import { researchCalendarKeywordCandidates } from "./researchCalendarKeywordCandidates";
import type { ScheduledTopicCandidate } from "./types/ScheduledTopicCandidate";
import type { TopicCandidate } from "./types/TopicCandidate";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type ExistingTopic = {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
  scheduledDate?: string;
};

type PlanTopicBatchOptions = {
  blankDates: string[];
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: ExistingTopic[];
  product: TopicDiscoveryProduct;
};

export const planTopicBatch = async ({
  blankDates,
  existingBlogs,
  existingTopics,
  product,
}: PlanTopicBatchOptions): Promise<ScheduledTopicCandidate[]> => {
  const dates = Array.from(new Set(blankDates)).slice(0, 30);

  if (dates.length === 0) {
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
      requestedCount: dates.length,
    });
  } catch {
    aiCandidates = [];
  }

  const uniqueCandidates = buildUniqueTopicCandidates({
    candidates: aiCandidates,
    existingTopics: existingItems,
  });

  if (uniqueCandidates.length < dates.length) {
    const fallbackCandidates = filterExactDuplicateCalendarCandidates(
      buildFallbackCalendarKeywordCandidates(product),
      [...existingItems, ...uniqueCandidates],
    );

    uniqueCandidates.push(...fallbackCandidates);
  }

  const selectedCandidates = uniqueCandidates.slice(0, dates.length);
  const researchedCandidates =
    await researchCalendarKeywordCandidates(selectedCandidates);

  return assignTopicCandidatesToDates({
    candidates: researchedCandidates,
    dates,
  });
};
