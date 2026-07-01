import type { TopicDiscoveryAeoInsight } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryAeoInsight";

export const buildAeoTopicCandidateNotes = (
  insight: TopicDiscoveryAeoInsight,
) => {
  return [
    insight.productMentioned
      ? "The product appears in the AI answer."
      : "The product does not appear in the AI answer.",
    insight.summary,
    ...insight.recommendations,
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
};
