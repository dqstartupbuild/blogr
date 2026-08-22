import { EmptyState } from "./EmptyState";
import { TopicRow } from "./TopicRow";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicListProps = {
  calendarDateKeys: string[];
  deleteTopic: DeleteTopic;
  occupiedCalendarDates: string[];
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicList = ({
  calendarDateKeys,
  deleteTopic,
  occupiedCalendarDates,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  scheduleTopicOnCalendar,
  topics,
  writeBlog,
}: TopicListProps) => {
  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,1fr)_140px_110px_140px] gap-4 border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/60 lg:grid">
        <span>Topic</span>
        <span>Status</span>
        <span>Articles</span>
        <span className="text-right">Actions</span>
      </div>
      {topics.map((topic) => (
        <TopicRow
          calendarDateKeys={calendarDateKeys}
          deleteTopic={deleteTopic}
          key={topic.id}
          occupiedCalendarDates={occupiedCalendarDates}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
          topic={topic}
          writeBlog={writeBlog}
        />
      ))}
    </div>
  );
};
