import { removeTopicPlannerPrefix } from "./removeTopicPlannerPrefix";

export const normalizeTopicKeyword = (keyword: string) => {
  return removeTopicPlannerPrefix(keyword).replace(/\s+/g, " ").trim();
};
