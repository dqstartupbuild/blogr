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
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarDayCellProps = {
  addScheduledTopic: AddScheduledTopic;
  dateKey: string;
  deleteTopic: DeleteTopic;
  isToday: boolean;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  topic?: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarDayCell = ({
  addScheduledTopic,
  dateKey,
  deleteTopic,
  isToday,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topic,
  writeBlog,
}: CalendarDayCellProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <section className="min-h-44 border-b border-r border-black/10 bg-white p-2">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold ${
              isToday ? "bg-black text-white" : "text-black"
            }`}
          >
            {formatCalendarDayNumber(dateKey)}
          </span>
          <span className="text-xs font-semibold uppercase text-black/40">
            {formatCalendarMonthName(dateKey)}
          </span>
        </div>
        {isToday ? (
          <span className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/60">
            Today
          </span>
        ) : null}
      </div>
      {topic ? (
        <CalendarTopicCard
          deleteTopic={deleteTopic}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
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
        />
      ) : null}
    </section>
  );
};
