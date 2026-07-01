"use client";

import { useState } from "react";
import { CalendarAddTopicDialog } from "./CalendarAddTopicDialog";
import { CalendarEmptyDay } from "./CalendarEmptyDay";
import { CalendarTopicCard } from "./CalendarTopicCard";
import { formatCalendarDayNumber } from "../utils/formatCalendarDayNumber";
import { formatCalendarMonthName } from "../utils/formatCalendarMonthName";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarDayCellProps = {
  addScheduledTopic: AddScheduledTopic;
  calendarDateKeys: string[];
  dateKey: string;
  deleteTopic: DeleteTopic;
  isToday: boolean;
  occupiedCalendarDates: string[];
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  savedTopics: TopicItem[];
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  topic?: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarDayCell = ({
  addScheduledTopic,
  calendarDateKeys,
  dateKey,
  deleteTopic,
  isToday,
  occupiedCalendarDates,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  savedTopics,
  scheduleTopicOnCalendar,
  topic,
  writeBlog,
}: CalendarDayCellProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <section className="min-w-0 border-b border-r border-black/10 bg-white p-1 sm:min-h-44 sm:p-2">
      <div className="mb-1 flex min-w-0 items-start justify-between gap-1 sm:mb-2 sm:gap-2">
        <div className="flex min-w-0 items-baseline gap-1 sm:gap-1.5">
          <span
            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-xs font-semibold sm:h-8 sm:min-w-8 sm:px-2 sm:text-sm ${
              isToday ? "bg-black text-white" : "text-black"
            }`}
          >
            {formatCalendarDayNumber(dateKey)}
          </span>
          <span className="hidden text-xs font-semibold uppercase text-black/40 sm:inline">
            {formatCalendarMonthName(dateKey)}
          </span>
        </div>
        {isToday ? (
          <span className="hidden rounded-md border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/60 md:inline-flex">
            Today
          </span>
        ) : null}
      </div>
      {topic ? (
        <CalendarTopicCard
          calendarDateKeys={calendarDateKeys}
          deleteTopic={deleteTopic}
          occupiedCalendarDates={occupiedCalendarDates}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
          topic={topic}
          writeBlog={writeBlog}
        />
      ) : (
        <CalendarEmptyDay onAdd={() => setIsAddOpen(true)} />
      )}
      {isAddOpen ? (
        <CalendarAddTopicDialog
          addScheduledTopic={addScheduledTopic}
          dateKey={dateKey}
          onClose={() => setIsAddOpen(false)}
          savedTopics={savedTopics}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
        />
      ) : null}
    </section>
  );
};
