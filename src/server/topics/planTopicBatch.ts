import { runGoogleSearchScraper } from "../apify/runGoogleSearchScraper";
import { assignTopicCandidatesToDates } from "./assignTopicCandidatesToDates";
import { buildTopicBatchDiscoveryQueries } from "./buildTopicBatchDiscoveryQueries";
import { buildTopicCandidatesFromDiscovery } from "./buildTopicCandidatesFromDiscovery";
import { buildExpandedTopicCandidates } from "./buildExpandedTopicCandidates";
import { buildUniqueTopicCandidates } from "./buildUniqueTopicCandidates";
import { extractSerpSignals } from "./extractSerpSignals";
import { generateTopicIdeas } from "./generateTopicIdeas";
import { topicExpansionPatterns } from "./topicExpansionPatterns";
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
  let discoveryCandidates: TopicCandidate[] = [];

  try {
    const queries = buildTopicBatchDiscoveryQueries({
      product,
    });
    const records = await runGoogleSearchScraper({
      includeAiMode: false,
      queries,
      timeoutMs: 15000,
    });
    const signals = extractSerpSignals(records);
    const discovery = await generateTopicIdeas({
      existingBlogs,
      existingTopics: existingTopics.map((topic) => topic.keyword),
      product,
      signals,
    });
    discoveryCandidates = buildTopicCandidatesFromDiscovery(discovery);
  } catch {
    discoveryCandidates = [];
  }

  let expansionOffset = 0;
  const expansionBatchSize = Math.max(dates.length, topicExpansionPatterns.length);
  const expandedCandidates: TopicCandidate[] = [];
  let uniqueCandidates: TopicCandidate[] = [];

  while (uniqueCandidates.length < dates.length) {
    const expansionBatch = buildExpandedTopicCandidates({
      limit: expansionBatchSize,
      offset: expansionOffset,
      product,
    });

    if (expansionBatch.length === 0) {
      break;
    }

    expandedCandidates.push(...expansionBatch);
    uniqueCandidates = buildUniqueTopicCandidates({
      candidates: [...discoveryCandidates, ...expandedCandidates],
      existingTopics: existingItems,
    });
    expansionOffset += expansionBatchSize;
  }

  return assignTopicCandidatesToDates({
    candidates: uniqueCandidates,
    dates,
  });
};
