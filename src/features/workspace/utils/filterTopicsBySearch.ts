import type { TopicItem } from "../types/TopicItem";

export const filterTopicsBySearch = (topics: TopicItem[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return topics;
  }

  return topics.filter((topic) => {
    return [topic.keyword, topic.notes || ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
};
