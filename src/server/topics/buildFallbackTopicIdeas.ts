import { collectSerpOrganicTitles } from "./collectSerpOrganicTitles";
import { collectSerpQuestions } from "./collectSerpQuestions";
import { collectSerpRelatedSearches } from "./collectSerpRelatedSearches";
import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { buildFallbackTopicIdea } from "./buildFallbackTopicIdea";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryIdea } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryIdea";

type BuildFallbackTopicIdeasOptions = {
  existingTopics: string[];
  signals: SerpSignal[];
};

export const buildFallbackTopicIdeas = ({
  existingTopics,
  signals,
}: BuildFallbackTopicIdeasOptions): TopicDiscoveryIdea[] => {
  const questions = collectSerpQuestions(signals);
  const relatedSearches = collectSerpRelatedSearches(signals);
  const organicTitles = collectSerpOrganicTitles(signals);
  const existingKeys = new Set(
    existingTopics.map((topic) => topic.trim().toLowerCase()),
  );

  return dedupeTopicStrings([...questions, ...relatedSearches, ...organicTitles])
    .filter((title) => !existingKeys.has(title.toLowerCase()))
    .slice(0, 10)
    .map((title) => buildFallbackTopicIdea({ questions, signals, title }));
};
