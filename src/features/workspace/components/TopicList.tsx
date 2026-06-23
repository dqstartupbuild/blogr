import { EmptyState } from "./EmptyState";
import { TopicRow } from "./TopicRow";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicListProps = {
  refreshTopicBrief: (topicId: string) => Promise<string>;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicList = ({
  refreshTopicBrief,
  topics,
  writeBlog,
}: TopicListProps) => {
  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <div className="mt-4 divide-y divide-black overflow-hidden rounded-md border border-black">
      {topics.map((topic) => (
        <TopicRow
          key={topic.id}
          refreshTopicBrief={refreshTopicBrief}
          topic={topic}
          writeBlog={writeBlog}
        />
      ))}
    </div>
  );
};
