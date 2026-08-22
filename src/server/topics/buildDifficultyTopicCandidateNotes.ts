import type { TopicDiscoveryDifficultyNote } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryDifficultyNote";

export const buildDifficultyTopicCandidateNotes = (
  note: TopicDiscoveryDifficultyNote,
) => {
  return [`Level: ${note.level}`, note.reason]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
};
