import type { TopicItem } from "../types/TopicItem";

const demoTopicNow = Date.now();

export const demoTopics: TopicItem[] = [
  {
    createdAt: demoTopicNow - 1000 * 60 * 60 * 24,
    id: "topic-weekly-plan",
    keyword: "how to plan your week as a founder",
    status: "saved",
  },
  {
    createdAt: demoTopicNow - 1000 * 60 * 60 * 24 * 3,
    id: "topic-team-priorities",
    keyword: "how to choose team priorities",
    status: "written",
    blogId: "blog-team-priorities",
  },
];
