import { FilteredTopicList } from "./FilteredTopicList";
import { TopicDiscoveryLauncher } from "./TopicDiscoveryLauncher";
import { TopicCreator } from "./TopicCreator";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type TopicsPanelProps = {
  topics: TopicItem[];
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  deleteTopic: DeleteTopic;
  discoverTopicIdeas: DiscoverTopicIdeas;
  listState: TopicListViewState;
  refreshTopicBrief: RefreshTopicBrief;
  saveTopicBrief: SaveTopicBrief;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicsPanel = ({
  topics,
  addTopic,
  deleteTopic,
  discoverTopicIdeas,
  listState,
  refreshTopicBrief,
  saveTopicBrief,
  writeBlog,
}: TopicsPanelProps) => {
  return (
    <section className="space-y-6">
      <WorkspacePageHeader
        action={
          <TopicDiscoveryLauncher
            addTopic={addTopic}
            discoverTopicIdeas={discoverTopicIdeas}
          />
        }
        description="Save the ideas you want to turn into articles."
        title="Topics"
      />
      <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <TopicCreator addTopic={addTopic} />
      </div>
      <FilteredTopicList
        deleteTopic={deleteTopic}
        listState={listState}
        refreshTopicBrief={refreshTopicBrief}
        saveTopicBrief={saveTopicBrief}
        topics={topics}
        writeBlog={writeBlog}
      />
    </section>
  );
};
