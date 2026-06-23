import type { TopicDiscoveryIdea } from "../types/topicDiscovery/TopicDiscoveryIdea";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

export const findBestTopicDiscoveryIdea = (
  discovery: TopicDiscoveryResult,
  keyword: string,
): TopicDiscoveryIdea | undefined => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return (
    discovery.ideas.find(
      (idea) => idea.title.trim().toLowerCase() === normalizedKeyword,
    ) ||
    discovery.ideas.find((idea) =>
      idea.title.trim().toLowerCase().includes(normalizedKeyword),
    ) ||
    discovery.ideas[0]
  );
};
