import type { BlogItem } from "../types/BlogItem";
import type { TopicItem } from "../types/TopicItem";
import { getLocalDateKey } from "./getLocalDateKey";

export const backfillDemoTopicCalendarDates = ({
  blogs,
  topics,
}: {
  blogs: BlogItem[];
  topics: TopicItem[];
}) => {
  const blogsById = new Map(blogs.map((blog) => [blog.id, blog]));

  return topics.map((topic) => {
    if (topic.scheduledDate || topic.status !== "written" || !topic.blogId) {
      return topic;
    }

    const blog = blogsById.get(topic.blogId);
    const timestamp = topic.createdAt || blog?.createdAt || blog?.updatedAt;

    if (!timestamp) {
      return topic;
    }

    return {
      ...topic,
      scheduledDate: getLocalDateKey(new Date(timestamp)),
    };
  });
};
