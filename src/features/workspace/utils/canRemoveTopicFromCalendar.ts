import type { TopicItem } from "../types/TopicItem";

export const canRemoveTopicFromCalendar = (topic: TopicItem) => {
  return (
    Boolean(topic.scheduledDate) &&
    topic.status !== "written" &&
    topic.status !== "published"
  );
};
