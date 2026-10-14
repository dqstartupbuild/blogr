"use client";

import { useState, type FormEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { TextField } from "./TextField";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";

type CalendarCreateTopicFormProps = {
  addScheduledTopic: AddScheduledTopic;
  dateKey: string;
  onAdded: () => void;
};

export const CalendarCreateTopicForm = ({
  addScheduledTopic,
  dateKey,
  onAdded,
}: CalendarCreateTopicFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    void Promise.resolve(addScheduledTopic(keyword, dateKey, notes))
      .then(onAdded)
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not add that topic.",
        );
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
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
        <PrimaryButton disabled={!keyword.trim() || isSaving} type="submit">
          {isSaving ? "Adding..." : "Add topic"}
        </PrimaryButton>
      </div>
    </form>
  );
};
