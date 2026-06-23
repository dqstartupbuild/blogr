import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

export const buildRefreshPlanMdxSection = (item: TopicDiscoveryPlanItem) => {
  return [
    "## Notes to Work In",
    "",
    `### ${item.title}`,
    "",
    item.summary,
    "",
    ...item.notes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `- ${line.replace(/^- /, "")}`),
  ].join("\n");
};
