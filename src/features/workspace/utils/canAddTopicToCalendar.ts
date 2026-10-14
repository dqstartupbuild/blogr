import type { TopicItem } from "../types/TopicItem";

export const canAddTopicToCalendar = (topic: TopicItem) => {
  return topic.status === "saved" || topic.status === "failed";
};
