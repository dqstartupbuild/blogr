import type { TopicDiscoveryPlanItem } from "./topicDiscovery/TopicDiscoveryPlanItem";

export type ApplyDiscoveryPlan = (
  item: TopicDiscoveryPlanItem,
) => Promise<void> | void;
