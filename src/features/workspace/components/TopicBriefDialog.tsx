"use client";

import { useState } from "react";
import { FileSearch } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import type { TopicItem } from "../types/TopicItem";

type TopicBriefDialogProps = {
  onClose: () => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  topic: TopicItem;
};

export const TopicBriefDialog = ({
  onClose,
  refreshTopicBrief,
  topic,
}: TopicBriefDialogProps) => {
  const [briefText, setBriefText] = useState(topic.notes || "");
  const [message, setMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasBrief = briefText.trim().length > 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setMessage("");

    void refreshTopicBrief(topic.id)
      .then((notes) => {
        setBriefText(notes);
        setMessage("Brief saved.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not find a brief yet.",
        );
      })
      .finally(() => setIsRefreshing(false));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <div
        aria-modal="true"
        className="grid max-h-full w-full max-w-2xl gap-4 overflow-auto rounded-lg border border-black bg-white p-5"
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black">Topic brief</h2>
          <p className="text-sm text-black">{topic.keyword}</p>
        </div>
        {hasBrief ? (
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-black bg-white p-3 text-sm text-black">
            {briefText}
          </pre>
        ) : (
          <p className="rounded-md border border-black p-3 text-sm text-black">
            No search brief has been saved for this topic yet.
          </p>
        )}
        {message ? <p className="text-sm text-black">{message}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isRefreshing} onClick={onClose}>
            Close
          </SecondaryButton>
          <PrimaryButton
            disabled={isRefreshing}
            onClick={handleRefresh}
            type="button"
          >
            <FileSearch size={16} aria-hidden="true" />
            {isRefreshing
              ? "Searching..."
              : hasBrief
                ? "Refresh brief"
                : "Find brief"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
