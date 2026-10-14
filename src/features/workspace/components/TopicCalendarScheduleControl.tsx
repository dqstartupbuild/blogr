"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { TopicCalendarDayDropdown } from "./TopicCalendarDayDropdown";
import { getSchedulableCalendarDateKeys } from "../utils/getSchedulableCalendarDateKeys";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";

type TopicCalendarScheduleControlProps = {
  calendarDateKeys: string[];
  occupiedCalendarDates: string[];
  onScheduled: () => void;
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  topic: TopicItem;
};

export const TopicCalendarScheduleControl = ({
  calendarDateKeys,
  occupiedCalendarDates,
  onScheduled,
  scheduleTopicOnCalendar,
  topic,
}: TopicCalendarScheduleControlProps) => {
  const takenDateKeys = useMemo(
    () => occupiedCalendarDates.filter((date) => date !== topic.scheduledDate),
    [occupiedCalendarDates, topic.scheduledDate],
  );
  const openDateKeys = useMemo(() => {
    const takenDates = new Set(takenDateKeys);

    return getSchedulableCalendarDateKeys(calendarDateKeys).filter(
      (date) => !takenDates.has(date),
    );
  }, [calendarDateKeys, takenDateKeys]);
  const [selectedDate, setSelectedDate] = useState(
    topic.scheduledDate || openDateKeys[0] || "",
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const activeDate = openDateKeys.includes(selectedDate)
    ? selectedDate
    : topic.scheduledDate || openDateKeys[0] || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeDate || activeDate === topic.scheduledDate) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    void Promise.resolve(scheduleTopicOnCalendar(topic.id, activeDate))
      .then(onScheduled)
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not add this to the calendar yet.",
        );
      })
      .finally(() => setIsSaving(false));
  };

  if (openDateKeys.length === 0) {
    return (
      <p className="min-w-0 rounded-md border border-black/10 bg-black/[0.03] p-3 text-sm leading-6 text-black/60">
        No open days in this month.
      </p>
    );
  }

  return (
    <form
      className="grid min-w-0 gap-3 rounded-md border border-black/10 bg-black/[0.03] p-3"
      onSubmit={handleSubmit}
    >
      <TopicCalendarDayDropdown
        calendarDateKeys={calendarDateKeys}
        currentDate={topic.scheduledDate}
        onSelect={setSelectedDate}
        openDateKeys={openDateKeys}
        selectedDate={activeDate}
        takenDateKeys={takenDateKeys}
      />
      {message ? <p className="text-sm text-black">{message}</p> : null}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:justify-end">
        <PrimaryButton
          disabled={!activeDate || activeDate === topic.scheduledDate || isSaving}
          type="submit"
        >
          <CalendarPlus size={16} aria-hidden="true" />
          {topic.scheduledDate ? "Move on calendar" : "Add to calendar"}
        </PrimaryButton>
      </div>
    </form>
  );
};
