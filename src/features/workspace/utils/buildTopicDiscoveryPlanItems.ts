import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

export const buildTopicDiscoveryPlanItems = (
  discovery: TopicDiscoveryResult,
): TopicDiscoveryPlanItem[] => {
  const ideaTitles = discovery.ideas.map((idea) => idea.title);
  const questionItems: TopicDiscoveryPlanItem[] = discovery.faqQuestions
    .slice(0, 8)
    .map((question, index) => ({
      id: `question-${index}-${question}`,
      notes: [
        `Search plan: ${question}`,
        "",
        "Use this as an FAQ section, a short answer section, or a supporting section inside a related blog.",
        "",
        "Related discovered topics:",
        ...ideaTitles.map((title) => `- ${title}`),
      ].join("\n"),
      relatedTopicTitles: ideaTitles.slice(0, 4),
      sourceType: "question",
      summary: "A real question searchers ask.",
      title: question,
    }));
  const gapItems: TopicDiscoveryPlanItem[] = discovery.contentGaps.map(
    (gap, index) => ({
      id: `gap-${index}-${gap.title}`,
      notes: [
        `Search gap: ${gap.title}`,
        "",
        gap.reason,
        gap.source ? `Source: ${gap.source}` : "",
        "",
        "Use this to sharpen the angle, examples, or sections in a related post.",
      ].join("\n"),
      relatedTopicTitles: ideaTitles.slice(0, 4),
      sourceType: "gap",
      summary: gap.reason,
      title: `Cover this gap: ${gap.title}`,
    }),
  );
  const comparisonItems: TopicDiscoveryPlanItem[] =
    discovery.comparisonTopics.map((topic, index) => ({
      id: `comparison-${index}-${topic}`,
      notes: [
        `Comparison plan: ${topic}`,
        "",
        "Use this for a bottom-of-funnel post that helps readers compare options before they choose.",
      ].join("\n"),
      relatedTopicTitles: ideaTitles.filter((title) =>
        title.toLowerCase().includes(topic.toLowerCase()),
      ),
      sourceType: "comparison",
      summary: "A comparison or alternatives angle from search patterns.",
      title: topic,
    }));
  const clusterItems: TopicDiscoveryPlanItem[] = discovery.clusters.map(
    (cluster, index) => ({
      id: `cluster-${index}-${cluster.name}`,
      notes: [
        `Content cluster: ${cluster.name}`,
        "",
        cluster.purpose,
        "",
        "Topics in this cluster:",
        ...cluster.topicTitles.map((title) => `- ${title}`),
      ].join("\n"),
      relatedTopicTitles: cluster.topicTitles,
      sourceType: "cluster",
      summary: cluster.purpose,
      title: `Plan a ${cluster.name.toLowerCase()} cluster`,
    }),
  );
  const refreshItems: TopicDiscoveryPlanItem[] =
    discovery.refreshSuggestions.map((suggestion, index) => ({
      id: `refresh-${index}-${suggestion.blogTitle}`,
      notes: [
        `Refresh plan: ${suggestion.blogTitle}`,
        "",
        suggestion.reason,
        "",
        "Updates to make:",
        ...suggestion.updates.map((update) => `- ${update}`),
      ].join("\n"),
      relatedTopicTitles: ideaTitles.slice(0, 4),
      sourceType: "refresh",
      summary: suggestion.reason,
      title: `Refresh ${suggestion.blogTitle}`,
    }));
  const aeoItems: TopicDiscoveryPlanItem[] = discovery.aeoInsights.map(
    (insight, index) => ({
      id: `aeo-${index}-${insight.query}`,
      notes: [
        `AI answer plan: ${insight.query}`,
        "",
        insight.productMentioned
          ? "The product appears in the AI answer."
          : "The product does not appear in the AI answer.",
        insight.summary,
        "",
        "Ways to improve coverage:",
        ...insight.recommendations.map((recommendation) => `- ${recommendation}`),
      ].join("\n"),
      relatedTopicTitles: ideaTitles.slice(0, 4),
      sourceType: "aeo",
      summary: insight.productMentioned
        ? "The product appears in the AI answer."
        : "The product does not appear in the AI answer.",
      title: `Improve AI answer coverage for ${insight.query}`,
    }),
  );
  const difficultyItems: TopicDiscoveryPlanItem[] =
    discovery.difficultyNotes.map((note, index) => ({
      id: `difficulty-${index}-${note.query}`,
      notes: [
        `Difficulty note: ${note.query}`,
        "",
        `Level: ${note.level}`,
        note.reason,
        "",
        "Use this before choosing whether to write, narrow, or combine this topic.",
      ].join("\n"),
      relatedTopicTitles: ideaTitles.filter((title) =>
        title.toLowerCase().includes(note.query.toLowerCase()),
      ),
      sourceType: "difficulty",
      summary: `${note.level}: ${note.reason}`,
      title: `Review difficulty for ${note.query}`,
    }));

  return [
    ...questionItems,
    ...gapItems,
    ...comparisonItems,
    ...clusterItems,
    ...refreshItems,
    ...aeoItems,
    ...difficultyItems,
  ];
};
