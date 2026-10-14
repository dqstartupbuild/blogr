import { buildTopicDiscoveryIdeaNotes } from "@/features/workspace/utils/buildTopicDiscoveryIdeaNotes";
import { buildTopicDiscoveryPlanItems } from "@/features/workspace/utils/buildTopicDiscoveryPlanItems";
import { findBestTopicDiscoveryIdea } from "@/features/workspace/utils/findBestTopicDiscoveryIdea";
import type { TopicDiscoveryResult } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryResult";

type BuildTopicBriefNotesForKeywordOptions = {
  discovery: TopicDiscoveryResult;
  keyword: string;
};

export const buildTopicBriefNotesForKeyword = ({
  discovery,
  keyword,
}: BuildTopicBriefNotesForKeywordOptions) => {
  const idea = findBestTopicDiscoveryIdea(discovery, keyword);

  if (idea) {
    return buildTopicDiscoveryIdeaNotes({
      ...idea,
      title: keyword,
    });
  }

  const planItems = buildTopicDiscoveryPlanItems(discovery).slice(0, 8);

  if (planItems.length === 0) {
    return "";
  }

  return [
    `Search brief for: ${keyword}`,
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
