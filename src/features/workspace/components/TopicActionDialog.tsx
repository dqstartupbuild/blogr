"use client";

import { useState } from "react";
import { DeleteActionButton } from "./DeleteActionButton";
import { SecondaryButton } from "./SecondaryButton";
import { StatusBadge } from "./StatusBadge";
import { TopicBriefButton } from "./TopicBriefButton";
import { TopicBriefDialog } from "./TopicBriefDialog";
import { TopicCalendarScheduleControl } from "./TopicCalendarScheduleControl";
import { TopicOpenArticleButton } from "./TopicOpenArticleButton";
import { TopicRemoveFromCalendarButton } from "./TopicRemoveFromCalendarButton";
import { TopicRepurposeButton } from "./TopicRepurposeButton";
import { TopicRepurposeDialog } from "./TopicRepurposeDialog";
import { TopicSourceBadge } from "./TopicSourceBadge";
import { TopicWriteButton } from "./TopicWriteButton";
import { canAddTopicToCalendar } from "../utils/canAddTopicToCalendar";
import { canRemoveTopicFromCalendar } from "../utils/canRemoveTopicFromCalendar";
import { formatCalendarDateBadge } from "../utils/formatCalendarDateBadge";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicActionDialogProps = {
  calendarDateKeys: string[];
  deleteTopic: DeleteTopic;
  occupiedCalendarDates: string[];
  onClose: () => void;
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

export const TopicActionDialog = ({
  calendarDateKeys,
  deleteTopic,
  occupiedCalendarDates,
  onClose,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  scheduleTopicOnCalendar,
  topic,
  writeBlog,
}: TopicActionDialogProps) => {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isRepurposeOpen, setIsRepurposeOpen] = useState(false);
  const isWriting = topic.status === "writing";
  const hasBrief = Boolean(topic.notes?.trim());
  const canShowCalendarScheduleControl = canAddTopicToCalendar(topic);
  const canShowCalendarRemoveControl = canRemoveTopicFromCalendar(topic);

  const handleOpenBlog = (blogId: string) => {
    openBlogPreview(blogId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-x-hidden overflow-y-auto bg-black/40 px-3 py-6 sm:px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <article
        aria-modal="true"
        className="grid max-h-[calc(100dvh-3rem)] w-full max-w-2xl min-w-0 gap-5 overflow-x-hidden overflow-y-auto rounded-lg border border-black bg-white p-4 sm:p-5"
        role="dialog"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black/50">
              {topic.scheduledDate
                ? formatCalendarDateBadge(topic.scheduledDate)
                : "Saved topic"}
            </p>
            <h2 className="mt-1 min-w-0 break-words text-lg font-semibold leading-7 text-black sm:text-xl">
              {topic.keyword}
            </h2>
          </div>
          <div className="min-w-0 sm:flex-shrink-0">
            <SecondaryButton onClick={onClose} type="button">
              Close
            </SecondaryButton>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <StatusBadge status={topic.status} />
          <TopicSourceBadge sourceType={topic.sourceType} />
        </div>
        {topic.notes ? (
          <p className="min-w-0 break-words whitespace-pre-line rounded-md border border-black/10 bg-black/[0.03] p-3 text-sm leading-6 text-black/70">
            {topic.notes}
          </p>
        ) : (
          <p className="min-w-0 break-words rounded-md border border-black/10 bg-black/[0.03] p-3 text-sm leading-6 text-black/60">
            No brief yet.
          </p>
        )}
        {canShowCalendarScheduleControl ? (
          <TopicCalendarScheduleControl
            calendarDateKeys={calendarDateKeys}
            occupiedCalendarDates={occupiedCalendarDates}
            onScheduled={onClose}
            scheduleTopicOnCalendar={scheduleTopicOnCalendar}
            topic={topic}
          />
        ) : null}
        <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap">
          {topic.blogId ? (
            <TopicOpenArticleButton
              blogId={topic.blogId}
              onOpen={handleOpenBlog}
            />
          ) : null}
          <TopicBriefButton
            disabled={isWriting}
            hasBrief={hasBrief}
            onOpen={() => setIsBriefOpen(true)}
          />
          <TopicRepurposeButton
            disabled={isWriting}
            onOpen={() => setIsRepurposeOpen(true)}
          />
          <TopicWriteButton
            disabled={isWriting}
            onWrite={() => {
              void Promise.resolve(writeBlog(topic.id)).catch(() => undefined);
            }}
          />
          {canShowCalendarRemoveControl ? (
            <TopicRemoveFromCalendarButton
              onRemoved={onClose}
              removeTopicFromCalendar={removeTopicFromCalendar}
              topicId={topic.id}
            />
          ) : null}
          <DeleteActionButton
            confirmMessage="Delete this topic? Articles already created from it will stay in Articles."
            label="Delete"
            onDelete={async () => {
              await deleteTopic(topic.id);
              onClose();
            }}
          />
        </div>
        {isBriefOpen ? (
          <TopicBriefDialog
            key={topic.id}
            onClose={() => setIsBriefOpen(false)}
            refreshTopicBrief={refreshTopicBrief}
            saveTopicBrief={saveTopicBrief}
            topic={topic}
          />
        ) : null}
        <TopicRepurposeDialog
          isOpen={isRepurposeOpen}
          onClose={() => setIsRepurposeOpen(false)}
          onRepurpose={(sourceText) => writeBlog(topic.id, { sourceText })}
          topic={topic}
        />
      </article>
    </div>
  );
};
