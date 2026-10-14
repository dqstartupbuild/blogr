import type { TopicDiscoveryIdea } from "../types/topicDiscovery/TopicDiscoveryIdea";

export const buildTopicDiscoveryIdeaNotes = (idea: TopicDiscoveryIdea) => {
  return [
    `Search brief for: ${idea.title}`,
    "",
    `Intent: ${idea.brief.intent || idea.intent}`,
    `Angle: ${idea.angle}`,
    `Cluster: ${idea.cluster}`,
    `Difficulty: ${idea.difficulty}`,
    "",
    "Sections to cover:",
    ...idea.brief.sections.map((section) => `- ${section}`),
    "",
    "Questions to answer:",
    ...idea.faqQuestions.map((question) => `- ${question}`),
    "",
    "Weak spots to improve:",
    ...idea.brief.weakSpots.map((weakSpot) => `- ${weakSpot}`),
    "",
    "Title ideas:",
    ...idea.titleOptions.map((title) => `- ${title}`),
    "",
    "Meta description ideas:",
    ...idea.metaDescriptions.map((description) => `- ${description}`),
    "",
    "Sources:",
    ...idea.brief.sources.map((source) => `- ${source.title}: ${source.url}`),
  ].join("\n");
};
