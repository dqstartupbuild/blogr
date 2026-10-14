import { assignTopicCandidatesToDates } from "./assignTopicCandidatesToDates";
import { selectNewTopicCandidates } from "./selectNewTopicCandidates";
import type { ScheduledTopicCandidate } from "./types/ScheduledTopicCandidate";
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
  const candidates = await selectNewTopicCandidates({
    count: dates.length,
    existingBlogs,
    existingTopics,
    product,
  });

  return assignTopicCandidatesToDates({ candidates, dates });
};
