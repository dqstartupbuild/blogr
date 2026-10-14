import { buildTopicIntentKey } from "./buildTopicIntentKey";

export const buildTopicCandidateIntentKey = (keyword: string) => {
  return buildTopicIntentKey(keyword) || keyword.trim().toLowerCase();
};
