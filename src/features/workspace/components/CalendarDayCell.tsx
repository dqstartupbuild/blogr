"use client";

import { useState } from "react";
import { CalendarAddTopicDialog } from "./CalendarAddTopicDialog";
import { CalendarEmptyDay } from "./CalendarEmptyDay";
import { CalendarTopicCard } from "./CalendarTopicCard";
import { formatCalendarDateLabel } from "../utils/formatCalendarDateLabel";
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
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topic,
  writeBlog,
}: CalendarDayCellProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <section className="grid gap-3 rounded-lg border border-black/10 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-black">
          {formatCalendarDateLabel(dateKey)}
        </h3>
        <span className="text-xs font-semibold text-black/40">{dateKey}</span>
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
