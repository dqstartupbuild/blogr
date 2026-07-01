"use client";

import { useState } from "react";
import { CalendarTopicDialog } from "./CalendarTopicDialog";
import { StatusBadge } from "./StatusBadge";
import { TopicSourceBadge } from "./TopicSourceBadge";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarTopicCardProps = {
  deleteTopic: DeleteTopic;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  topic: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarTopicCard = ({
  deleteTopic,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topic,
  writeBlog,
}: CalendarTopicCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        aria-label={`Open ${topic.keyword}`}
        className="grid w-full min-w-0 gap-1 rounded-md border border-black/10 bg-black/[0.03] p-1 text-left transition hover:border-black/25 hover:bg-black/[0.06] focus:outline-none focus:ring-2 focus:ring-black sm:gap-2 sm:p-2"
        onClick={() => setIsDialogOpen(true)}
        type="button"
      >
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <span className="min-w-0">
            <StatusBadge status={topic.status} />
          </span>
          <span className="min-w-0">
            <TopicSourceBadge sourceType={topic.sourceType} />
          </span>
        </div>
        <p className="line-clamp-3 min-w-0 break-words text-[11px] font-semibold leading-4 text-black sm:text-sm sm:leading-5">
          {topic.keyword}
        </p>
        {topic.notes ? (
          <p className="hidden text-xs leading-5 text-black/60 md:line-clamp-2">
            {topic.notes}
          </p>
        ) : null}
      </button>
      {isDialogOpen ? (
        <CalendarTopicDialog
          deleteTopic={deleteTopic}
          onClose={() => setIsDialogOpen(false)}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          topic={topic}
          writeBlog={writeBlog}
        />
      ) : null}
    </>
  );
};
