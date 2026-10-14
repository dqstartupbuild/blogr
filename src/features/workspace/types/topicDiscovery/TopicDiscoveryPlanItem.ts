export type TopicDiscoveryPlanItem = {
  id: string;
  notes: string;
  relatedTopicTitles: string[];
  sourceType:
    | "question"
    | "gap"
    | "comparison"
    | "cluster"
    | "refresh"
    | "aeo"
    | "difficulty";
  summary: string;
  title: string;
};
