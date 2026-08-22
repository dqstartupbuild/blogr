"use client";

import { CalendarAddExistingTopicForm } from "./CalendarAddExistingTopicForm";
import { CalendarCreateTopicForm } from "./CalendarCreateTopicForm";
import { SecondaryButton } from "./SecondaryButton";
import { formatCalendarDateBadge } from "../utils/formatCalendarDateBadge";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";

type CalendarAddTopicDialogProps = {
  addScheduledTopic: AddScheduledTopic;
  dateKey: string;
  onClose: () => void;
  savedTopics: TopicItem[];
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
};

export const CalendarAddTopicDialog = ({
  addScheduledTopic,
  dateKey,
  onClose,
  savedTopics,
  scheduleTopicOnCalendar,
}: CalendarAddTopicDialogProps) => {
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
        className="grid max-h-[calc(100dvh-3rem)] w-full max-w-lg min-w-0 gap-4 overflow-x-hidden overflow-y-auto rounded-lg border border-black bg-white p-4 sm:p-5"
        role="dialog"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid min-w-0 gap-1">
            <h2 className="text-lg font-semibold text-black">
              Add {formatCalendarDateBadge(dateKey)}
            </h2>
            <p className="text-sm leading-6 text-black/60">
              Use a saved topic or add a new keyword.
            </p>
          </div>
          <div className="sm:flex-shrink-0">
            <SecondaryButton onClick={onClose} type="button">
              Close
            </SecondaryButton>
          </div>
        </div>
        <CalendarAddExistingTopicForm
          dateKey={dateKey}
          onAdded={onClose}
          savedTopics={savedTopics}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
        />
        <div className="grid gap-3 border-t border-black/10 pt-4">
          <p className="text-sm font-semibold text-black">Add a new topic</p>
          <CalendarCreateTopicForm
            addScheduledTopic={addScheduledTopic}
            dateKey={dateKey}
            onAdded={onClose}
          />
        </div>
      </article>
    </div>
  );
};
