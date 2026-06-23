import { FilteredTopicList } from "./FilteredTopicList";
import { SectionTitle } from "./SectionTitle";
import { TopicDiscoveryLauncher } from "./TopicDiscoveryLauncher";
import { TopicCreator } from "./TopicCreator";
import type { TopicItem } from "../types/TopicItem";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type TopicsPanelProps = {
  topics: TopicItem[];
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  discoverTopicIdeas: DiscoverTopicIdeas;
  refreshTopicBrief: RefreshTopicBrief;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicsPanel = ({
  topics,
  addTopic,
  discoverTopicIdeas,
  refreshTopicBrief,
  writeBlog,
}: TopicsPanelProps) => {
  return (
    <section className="rounded-lg border border-black bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle title="Topics" />
        <TopicDiscoveryLauncher
          addTopic={addTopic}
          discoverTopicIdeas={discoverTopicIdeas}
        />
      </div>
      <TopicCreator addTopic={addTopic} />
      <FilteredTopicList
        refreshTopicBrief={refreshTopicBrief}
        topics={topics}
        writeBlog={writeBlog}
      />
    </section>
  );
};
