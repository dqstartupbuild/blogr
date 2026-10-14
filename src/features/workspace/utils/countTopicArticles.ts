import type { TopicItem } from "../types/TopicItem";

export const countTopicArticles = (topic: TopicItem) => {
  return topic.blogId ? 1 : 0;
};
