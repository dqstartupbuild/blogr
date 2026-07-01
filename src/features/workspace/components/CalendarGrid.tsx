import { CalendarDayCell } from "./CalendarDayCell";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarGridProps = {
  addScheduledTopic: AddScheduledTopic;
  dateKeys: string[];
  deleteTopic: DeleteTopic;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarGrid = ({
  addScheduledTopic,
  dateKeys,
  deleteTopic,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topics,
  writeBlog,
}: CalendarGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dateKeys.map((dateKey) => (
        <CalendarDayCell
          addScheduledTopic={addScheduledTopic}
          dateKey={dateKey}
          deleteTopic={deleteTopic}
          key={dateKey}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          topic={topics.find((topic) => topic.scheduledDate === dateKey)}
          writeBlog={writeBlog}
        />
      ))}
    </div>
  );
};
