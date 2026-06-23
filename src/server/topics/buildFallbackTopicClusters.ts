import type { TopicDiscoveryCluster } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryCluster";
import type { TopicDiscoveryIdea } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryIdea";

export const buildFallbackTopicClusters = (
  ideas: TopicDiscoveryIdea[],
): TopicDiscoveryCluster[] => {
  const names = Array.from(new Set(ideas.map((idea) => idea.cluster)));

  return names.map((name) => ({
    name,
    purpose:
      name === "Comparison posts"
        ? "Help readers compare options before they choose."
        : "Answer common questions with clear, useful advice.",
    topicTitles: ideas
      .filter((idea) => idea.cluster === name)
      .map((idea) => idea.title)
      .slice(0, 6),
  }));
};
