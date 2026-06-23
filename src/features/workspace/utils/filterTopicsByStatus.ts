import type { TopicItem } from "../types/TopicItem";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";

export const filterTopicsByStatus = (
  topics: TopicItem[],
  filter: TopicStatusFilter,
) => {
  if (filter === "all") {
    return topics;
  }

  return topics.filter((topic) => topic.status === filter);
};
