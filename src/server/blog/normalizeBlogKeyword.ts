import { removeTopicPlannerPrefix } from "../topics/removeTopicPlannerPrefix";

export const normalizeBlogKeyword = (keyword: string) => {
  return removeTopicPlannerPrefix(keyword).replace(/\s+/g, " ").trim();
};
