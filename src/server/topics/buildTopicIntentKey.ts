import { removeTopicPlannerPrefix } from "./removeTopicPlannerPrefix";
import { tokenizeTopicIntent } from "./tokenizeTopicIntent";

export const buildTopicIntentKey = (keyword: string) => {
  const tokens = Array.from(new Set(tokenizeTopicIntent(removeTopicPlannerPrefix(keyword))));

  return tokens.sort((left, right) => left.localeCompare(right)).join("-");
};
