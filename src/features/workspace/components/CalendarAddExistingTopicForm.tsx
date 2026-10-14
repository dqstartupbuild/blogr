"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { canAddTopicToCalendar } from "../utils/canAddTopicToCalendar";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";

type CalendarAddExistingTopicFormProps = {
  dateKey: string;
  onAdded: () => void;
  savedTopics: TopicItem[];
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
};

export const CalendarAddExistingTopicForm = ({
  dateKey,
  onAdded,
  savedTopics,
  scheduleTopicOnCalendar,
}: CalendarAddExistingTopicFormProps) => {
  const availableTopics = useMemo(
    () =>
      savedTopics.filter(
        (topic) => !topic.scheduledDate && canAddTopicToCalendar(topic),
      ),
    [savedTopics],
  );
  const [selectedTopicId, setSelectedTopicId] = useState(
    availableTopics[0]?.id || "",
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const selectedTopic = availableTopics.find(
    (topic) => topic.id === selectedTopicId,
  );
  const activeTopicId = selectedTopic?.id || availableTopics[0]?.id || "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeTopicId) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    void Promise.resolve(scheduleTopicOnCalendar(activeTopicId, dateKey))
      .then(onAdded)
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not add that topic to this day.",
        );
      })
      .finally(() => setIsSaving(false));
  };

  if (availableTopics.length === 0) {
    return (
      <p className="rounded-md border border-black/10 bg-black/[0.03] p-3 text-sm leading-6 text-black/60">
        No saved or failed topics are ready to add.
      </p>
    );
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-black">
        Saved topic
        <select
          className="h-10 min-w-0 rounded-md border border-black/15 bg-white px-3 text-sm font-normal text-black outline-none transition focus:border-black"
          onChange={(event) => setSelectedTopicId(event.target.value)}
          value={activeTopicId}
        >
          {availableTopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.keyword}
            </option>
          ))}
        </select>
      </label>
      {message ? <p className="text-sm text-black">{message}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <PrimaryButton disabled={!activeTopicId || isSaving} type="submit">
          {isSaving ? "Adding..." : "Add saved topic"}
        </PrimaryButton>
      </div>
    </form>
  );
};
