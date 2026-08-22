import { FilteredTopicList } from "./FilteredTopicList";
import { TopicDiscoveryLauncher } from "./TopicDiscoveryLauncher";
import { TopicCreator } from "./TopicCreator";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type TopicsPanelProps = {
  topics: TopicItem[];
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  calendarDateKeys: string[];
  deleteTopic: DeleteTopic;
  discoverTopicIdeas: DiscoverTopicIdeas;
  listState: TopicListViewState;
  occupiedCalendarDates: string[];
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: RefreshTopicBrief;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicsPanel = ({
  topics,
  addTopic,
  calendarDateKeys,
  deleteTopic,
  discoverTopicIdeas,
  listState,
  occupiedCalendarDates,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  scheduleTopicOnCalendar,
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
        calendarDateKeys={calendarDateKeys}
        deleteTopic={deleteTopic}
        listState={listState}
        occupiedCalendarDates={occupiedCalendarDates}
        openBlogPreview={openBlogPreview}
        refreshTopicBrief={refreshTopicBrief}
        removeTopicFromCalendar={removeTopicFromCalendar}
        saveTopicBrief={saveTopicBrief}
        scheduleTopicOnCalendar={scheduleTopicOnCalendar}
        topics={topics}
        writeBlog={writeBlog}
      />
    </section>
  );
};
