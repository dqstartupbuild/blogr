import type { TopicDiscoveryContentGap } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryContentGap";

export const buildGapTopicCandidateNotes = (
  gap: TopicDiscoveryContentGap,
) => {
  return [gap.reason, gap.source ? `Source: ${gap.source}` : ""]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
};
