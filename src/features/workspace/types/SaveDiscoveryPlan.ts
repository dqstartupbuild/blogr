import type { TopicDiscoveryPlanItem } from "./topicDiscovery/TopicDiscoveryPlanItem";

export type SaveDiscoveryPlan = (
  item: TopicDiscoveryPlanItem,
) => Promise<void> | void;
