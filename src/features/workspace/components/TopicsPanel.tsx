import { SectionTitle } from "./SectionTitle";
import { TopicCreator } from "./TopicCreator";
import { TopicList } from "./TopicList";
import type { TopicItem } from "../types/TopicItem";

type TopicsPanelProps = {
  topics: TopicItem[];
  addTopic: (keyword: string) => void;
  writeBlog: (topicId: string) => void;
};

export const TopicsPanel = ({
  topics,
  addTopic,
  writeBlog,
}: TopicsPanelProps) => {
  return (
    <section className="rounded-lg border border-black bg-white p-4">
      <SectionTitle title="Topics" />
      <TopicCreator addTopic={addTopic} />
      <TopicList topics={topics} writeBlog={writeBlog} />
    </section>
  );
};
