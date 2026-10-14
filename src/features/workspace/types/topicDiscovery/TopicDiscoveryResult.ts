import type { TopicDiscoveryAeoInsight } from "./TopicDiscoveryAeoInsight";
import type { TopicDiscoveryCluster } from "./TopicDiscoveryCluster";
import type { TopicDiscoveryContentGap } from "./TopicDiscoveryContentGap";
import type { TopicDiscoveryDifficultyNote } from "./TopicDiscoveryDifficultyNote";
import type { TopicDiscoveryIdea } from "./TopicDiscoveryIdea";
import type { TopicDiscoveryRefreshSuggestion } from "./TopicDiscoveryRefreshSuggestion";

export type TopicDiscoveryResult = {
  ideas: TopicDiscoveryIdea[];
  clusters: TopicDiscoveryCluster[];
  faqQuestions: string[];
  contentGaps: TopicDiscoveryContentGap[];
  refreshSuggestions: TopicDiscoveryRefreshSuggestion[];
  comparisonTopics: string[];
  aeoInsights: TopicDiscoveryAeoInsight[];
  difficultyNotes: TopicDiscoveryDifficultyNote[];
  rawSignalsCount: number;
};
