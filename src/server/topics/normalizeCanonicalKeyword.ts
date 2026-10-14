import { removeTopicPlannerPrefix } from "./removeTopicPlannerPrefix";

export const normalizeCanonicalKeyword = (keyword: string) => {
  return removeTopicPlannerPrefix(keyword)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};
