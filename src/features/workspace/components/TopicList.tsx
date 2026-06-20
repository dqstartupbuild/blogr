import { EmptyState } from "./EmptyState";
import { TopicRow } from "./TopicRow";
import type { TopicItem } from "../types/TopicItem";

type TopicListProps = {
  topics: TopicItem[];
  writeBlog: (topicId: string) => void;
};

export const TopicList = ({ topics, writeBlog }: TopicListProps) => {
  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <div className="mt-4 divide-y divide-[#e6e0d4] overflow-hidden rounded-md border border-[#e6e0d4]">
      {topics.map((topic) => (
        <TopicRow key={topic.id} topic={topic} writeBlog={writeBlog} />
      ))}
    </div>
  );
};
