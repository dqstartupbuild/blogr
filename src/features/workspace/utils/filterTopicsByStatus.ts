import type { TopicItem } from "../types/TopicItem";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import { getScheduledAwareTopicStatus } from "./getScheduledAwareTopicStatus";

export const filterTopicsByStatus = (
  topics: TopicItem[],
  filter: TopicStatusFilter,
) => {
  if (filter === "all") {
    return topics;
  }

  return topics.filter(
    (topic) =>
      getScheduledAwareTopicStatus({
        scheduledDate: topic.scheduledDate,
        status: topic.status,
      }) === filter,
  );
};
