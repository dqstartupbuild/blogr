"use client";

import { useState, type FormEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TextField } from "./TextField";
import { formatCalendarDateBadge } from "../utils/formatCalendarDateBadge";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";

type CalendarAddTopicDialogProps = {
  addScheduledTopic: AddScheduledTopic;
  dateKey: string;
  onClose: () => void;
};

export const CalendarAddTopicDialog = ({
  addScheduledTopic,
  dateKey,
  onClose,
}: CalendarAddTopicDialogProps) => {
  const [keyword, setKeyword] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    void Promise.resolve(addScheduledTopic(keyword, dateKey, notes))
      .then(() => onClose())
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not add that topic.",
        );
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <form
        aria-modal="true"
        className="grid w-full max-w-lg gap-4 rounded-lg border border-black bg-white p-5"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black">
            Add {formatCalendarDateBadge(dateKey)}
          </h2>
          <p className="text-sm leading-6 text-black/60">
            Add one keyword for this day.
          </p>
        </div>
        <TextField
          label="Keyword"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="best project planning tools"
          value={keyword}
        />
        <label className="grid gap-2 text-sm font-semibold text-black">
          Notes
          <textarea
            className="min-h-28 rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-normal leading-6 text-black outline-none transition focus:border-black"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add a short angle, question, or reminder."
            value={notes}
          />
        </label>
        {message ? <p className="text-sm text-black">{message}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isSaving} onClick={onClose}>
            Close
          </SecondaryButton>
          <PrimaryButton
            disabled={!keyword.trim() || isSaving}
            type="submit"
          >
            {isSaving ? "Adding..." : "Add topic"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
