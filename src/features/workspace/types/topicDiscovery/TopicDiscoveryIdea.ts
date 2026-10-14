import type { TopicDiscoveryBrief } from "./TopicDiscoveryBrief";

export type TopicDiscoveryIdea = {
  title: string;
  angle: string;
  intent: string;
  cluster: string;
  difficulty: "low" | "medium" | "high";
  sourceSignals: string[];
  brief: TopicDiscoveryBrief;
  faqQuestions: string[];
  titleOptions: string[];
  metaDescriptions: string[];
};
