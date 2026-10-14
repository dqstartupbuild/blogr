import type { TopicDiscoveryRequest } from "./topicDiscovery/TopicDiscoveryRequest";
import type { TopicDiscoveryResult } from "./topicDiscovery/TopicDiscoveryResult";

export type DiscoverBlogRefreshIdeas = (
  blogId: string,
  request: TopicDiscoveryRequest,
) => Promise<TopicDiscoveryResult>;
