import { isComparisonTopic } from "./isComparisonTopic";

export const detectTopicCluster = (title: string) => {
  const normalized = title.toLowerCase();

  if (isComparisonTopic(title)) return "Comparison posts";
  if (normalized.includes("how ") || normalized.startsWith("how to ")) {
    return "How-to posts";
  }
  if (normalized.includes("problem") || normalized.includes("fix")) {
    return "Problem-aware posts";
  }

  return "Question-led posts";
};
