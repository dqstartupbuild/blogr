import { runGoogleSearchScraper } from "../apify/runGoogleSearchScraper";
import { buildTopicDiscoveryQueries } from "./buildTopicDiscoveryQueries";
import { extractSerpSignals } from "./extractSerpSignals";
import { generateTopicIdeas } from "./generateTopicIdeas";
import type { TopicDiscoveryResult } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryResult";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type DiscoverTopicIdeasForProductOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  includeAiAnswers: boolean;
  product: TopicDiscoveryProduct;
  seedKeyword?: string;
};

export const discoverTopicIdeasForProduct = async ({
  existingBlogs,
  existingTopics,
  includeAiAnswers,
  product,
  seedKeyword,
}: DiscoverTopicIdeasForProductOptions): Promise<TopicDiscoveryResult> => {
  const queries = buildTopicDiscoveryQueries({
    product,
    seedKeyword,
  });
  const records = await runGoogleSearchScraper({
    includeAiMode: includeAiAnswers,
    queries,
  });
  const signals = extractSerpSignals(records);

  return await generateTopicIdeas({
    existingBlogs,
    existingTopics,
    product,
    seedKeyword,
    signals,
  });
};
