import { CalendarDayCell } from "./CalendarDayCell";
import { CalendarSpacerCell } from "./CalendarSpacerCell";
import { CalendarWeekdayHeader } from "./CalendarWeekdayHeader";
import { buildCalendarDateSlots } from "../utils/buildCalendarDateSlots";
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
  const dateSlots = buildCalendarDateSlots(dateKeys);

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="min-w-[980px]">
        <CalendarWeekdayHeader />
        <div className="grid grid-cols-7">
          {dateSlots.map((dateKey, index) =>
            dateKey ? (
              <CalendarDayCell
                addScheduledTopic={addScheduledTopic}
                dateKey={dateKey}
                deleteTopic={deleteTopic}
                isToday={dateKey === dateKeys[0]}
                key={dateKey}
                openBlogPreview={openBlogPreview}
                refreshTopicBrief={refreshTopicBrief}
                removeTopicFromCalendar={removeTopicFromCalendar}
                saveTopicBrief={saveTopicBrief}
                topic={topics.find((topic) => topic.scheduledDate === dateKey)}
                writeBlog={writeBlog}
              />
            ) : (
              <CalendarSpacerCell key={`spacer-${index}`} />
            ),
          )}
        </div>
      </div>
    </div>
  );
};
