import { buildFallbackAeoInsights } from "./buildFallbackAeoInsights";
import { buildFallbackComparisonTopics } from "./buildFallbackComparisonTopics";
import { buildFallbackContentGaps } from "./buildFallbackContentGaps";
import { buildFallbackDifficultyNotes } from "./buildFallbackDifficultyNotes";
import { buildFallbackRefreshSuggestions } from "./buildFallbackRefreshSuggestions";
import { buildFallbackTopicClusters } from "./buildFallbackTopicClusters";
import { buildFallbackTopicIdeas } from "./buildFallbackTopicIdeas";
import { collectSerpQuestions } from "./collectSerpQuestions";
import type { TopicDiscoveryResult } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryResult";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type CreateFallbackTopicDiscoveryResultOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  product: TopicDiscoveryProduct;
  signals: SerpSignal[];
};

export const createFallbackTopicDiscoveryResult = ({
  existingBlogs,
  existingTopics,
  product,
  signals,
}: CreateFallbackTopicDiscoveryResultOptions): TopicDiscoveryResult => {
  const ideas = buildFallbackTopicIdeas({ existingTopics, signals });

  return {
    aeoInsights: buildFallbackAeoInsights({ product, signals }),
    clusters: buildFallbackTopicClusters(ideas),
    comparisonTopics: buildFallbackComparisonTopics({ product, signals }),
    contentGaps: buildFallbackContentGaps(signals),
    difficultyNotes: buildFallbackDifficultyNotes(signals),
    faqQuestions: collectSerpQuestions(signals).slice(0, 12),
    ideas,
    rawSignalsCount: signals.length,
    refreshSuggestions: buildFallbackRefreshSuggestions({
      blogs: existingBlogs,
      signals,
    }),
  };
};
