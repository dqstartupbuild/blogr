import { EmptyState } from "./EmptyState";
import { TopicRow } from "./TopicRow";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicListProps = {
  deleteTopic: (topicId: string) => Promise<void> | void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicList = ({
  deleteTopic,
  refreshTopicBrief,
  topics,
  writeBlog,
}: TopicListProps) => {
  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1fr)_120px_90px_480px] gap-4 border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/60 xl:grid">
        <span>Topic</span>
        <span>Status</span>
        <span>Articles</span>
        <span className="text-right">Actions</span>
      </div>
      {topics.map((topic) => (
        <TopicRow
          key={topic.id}
          deleteTopic={deleteTopic}
          refreshTopicBrief={refreshTopicBrief}
          topic={topic}
          writeBlog={writeBlog}
        />
      ))}
    </div>
  );
};
