import type { TopicDiscoveryIdea } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryIdea";

export const buildIdeaTopicCandidateNotes = (idea: TopicDiscoveryIdea) => {
  return [
    idea.angle,
    idea.brief.intent || idea.intent,
    ...idea.brief.sections,
    ...idea.faqQuestions,
    ...idea.brief.weakSpots,
    ...idea.titleOptions,
    ...idea.metaDescriptions,
    ...idea.brief.sources.map((source) => `${source.title}: ${source.url}`),
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
};
