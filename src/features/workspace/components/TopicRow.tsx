"use client";

import { useState } from "react";
import { SecondaryButton } from "./SecondaryButton";
import { StatusBadge } from "./StatusBadge";
import { TopicActionDialog } from "./TopicActionDialog";
import { countTopicArticles } from "../utils/countTopicArticles";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicRowProps = {
  calendarDateKeys: string[];
  deleteTopic: DeleteTopic;
  occupiedCalendarDates: string[];
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  topic: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicRow = ({
  calendarDateKeys,
  deleteTopic,
  occupiedCalendarDates,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  scheduleTopicOnCalendar,
  topic,
  writeBlog,
}: TopicRowProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const articleCount = countTopicArticles(topic);

  return (
    <article className="grid gap-4 border-b border-black/10 bg-white p-4 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_140px_110px_140px] lg:items-center">
      <button
        className="min-w-0 text-left"
        onClick={() => setIsDialogOpen(true)}
        type="button"
      >
        <p className="text-sm font-semibold leading-6 text-black">
          {topic.keyword}
        </p>
        {topic.notes ? (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-black/60">
            {topic.notes}
          </p>
        ) : null}
      </button>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 lg:hidden">
          Status
        </p>
        <StatusBadge status={topic.status} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 lg:hidden">
          Articles
        </p>
        <p className="text-sm font-medium text-black">{articleCount}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        <SecondaryButton onClick={() => setIsDialogOpen(true)} type="button">
          Open
        </SecondaryButton>
      </div>
      {isDialogOpen ? (
        <TopicActionDialog
          calendarDateKeys={calendarDateKeys}
          deleteTopic={deleteTopic}
          occupiedCalendarDates={occupiedCalendarDates}
          onClose={() => setIsDialogOpen(false)}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
          topic={topic}
          writeBlog={writeBlog}
        />
      ) : null}
    </article>
  );
};
