import type { TopicDiscoveryRequest } from "./TopicDiscoveryRequest";
import type { TopicDiscoveryResult } from "./TopicDiscoveryResult";

export type DiscoverTopicIdeas = (
  request: TopicDiscoveryRequest,
) => Promise<TopicDiscoveryResult>;
