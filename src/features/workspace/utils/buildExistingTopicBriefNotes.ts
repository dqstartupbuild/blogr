import { buildTopicDiscoveryIdeaNotes } from "./buildTopicDiscoveryIdeaNotes";
import { buildTopicDiscoveryPlanItems } from "./buildTopicDiscoveryPlanItems";
import { findBestTopicDiscoveryIdea } from "./findBestTopicDiscoveryIdea";
import type { TopicItem } from "../types/TopicItem";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

export const buildExistingTopicBriefNotes = (
  topic: TopicItem,
  discovery: TopicDiscoveryResult,
) => {
  const idea = findBestTopicDiscoveryIdea(discovery, topic.keyword);

  if (idea) {
    return buildTopicDiscoveryIdeaNotes({
      ...idea,
      title: topic.keyword,
    });
  }

  const planItems = buildTopicDiscoveryPlanItems(discovery).slice(0, 8);

  if (planItems.length === 0) {
    return "";
  }

  return [
    `Search brief for: ${topic.keyword}`,
    "",
    "Use these search signals to plan this topic.",
    "",
    ...planItems.flatMap((item) => [
      `${item.sourceType}: ${item.title}`,
      item.summary,
      "",
    ]),
  ].join("\n");
};
