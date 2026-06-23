import { buildRefreshPlanMdxSection } from "./buildRefreshPlanMdxSection";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

export const appendRefreshPlanToMdx = (
  mdx: string,
  item: TopicDiscoveryPlanItem,
) => {
  if (mdx.includes(item.title)) {
    return mdx;
  }

  const section = buildRefreshPlanMdxSection(item);
  const trimmedMdx = mdx.trim();

  return trimmedMdx ? `${trimmedMdx}\n\n${section}` : section;
};
