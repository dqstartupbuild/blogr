import { selectNewTopicCandidates } from "./selectNewTopicCandidates";
import { topicIdeasCount } from "./topicIdeasCount";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";
import type { TopicIdeaCandidate } from "./types/TopicIdeaCandidate";

type PlanTopicIdeasOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: { canonicalKeyword?: string; intentKey?: string; keyword: string }[];
  product: TopicDiscoveryProduct;
};

// Same keyword generation as calendar AI fill, but returns unscheduled ideas.
export const planTopicIdeas = async (
  options: PlanTopicIdeasOptions,
): Promise<TopicIdeaCandidate[]> => {
  const candidates = await selectNewTopicCandidates({
    ...options,
    count: topicIdeasCount,
  });

  return candidates.map((candidate) => ({
    canonicalKeyword: candidate.canonicalKeyword,
    intentKey: candidate.intentKey,
    keyword: candidate.keyword,
    notes: candidate.notes,
    sourceType: candidate.sourceType,
  }));
};
