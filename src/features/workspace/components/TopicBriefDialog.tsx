"use client";

import { useState } from "react";
import { FileSearch, Save } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import type { TopicItem } from "../types/TopicItem";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";

type TopicBriefDialogProps = {
  onClose: () => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  saveTopicBrief: SaveTopicBrief;
  topic: TopicItem;
};

export const TopicBriefDialog = ({
  onClose,
  refreshTopicBrief,
  saveTopicBrief,
  topic,
}: TopicBriefDialogProps) => {
  const [savedBriefText, setSavedBriefText] = useState(topic.notes || "");
  const [draftBriefText, setDraftBriefText] = useState(topic.notes || "");
  const [message, setMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasBrief = draftBriefText.trim().length > 0;
  const hasChanges = draftBriefText.trim() !== savedBriefText.trim();
  const isBusy = isRefreshing || isSaving;
  const isLocked = Boolean(topic.blogId) || topic.status === "written";

  const handleRefresh = () => {
    setIsRefreshing(true);
    setMessage("");

    void refreshTopicBrief(topic.id)
      .then((notes) => {
        setSavedBriefText(notes);
        setDraftBriefText(notes);
        setMessage("Brief saved.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not find a brief yet.",
        );
      })
      .finally(() => setIsRefreshing(false));
  };

  const handleSave = () => {
    setIsSaving(true);
    setMessage("");

    void saveTopicBrief(topic.id, draftBriefText)
      .then((notes) => {
        setSavedBriefText(notes);
        setDraftBriefText(notes);
        setMessage(notes.trim() ? "Brief saved." : "Brief cleared.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not save this brief.",
        );
      })
      .finally(() => setIsSaving(false));
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
        <label className="grid gap-2 text-sm font-semibold text-black">
          Brief notes
          <textarea
            className="min-h-72 resize-y rounded-md border border-black bg-white p-3 text-sm font-normal leading-6 text-black outline-none transition focus:ring-2 focus:ring-black"
            onChange={(event) => setDraftBriefText(event.target.value)}
            placeholder="Add the points you want this article to cover."
            readOnly={isLocked}
            value={draftBriefText}
          />
        </label>
        {isLocked ? (
          <p className="text-sm text-black/60">
            This brief is locked because the article has already been written.
          </p>
        ) : null}
        {!hasBrief ? (
          <p className="text-sm text-black/60">
            No brief has been saved for this topic yet.
          </p>
        ) : null}
        {message ? <p className="text-sm text-black">{message}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isBusy} onClick={onClose}>
            Close
          </SecondaryButton>
          {isLocked ? null : (
            <>
              <SecondaryButton
                disabled={isBusy || !hasChanges}
                onClick={handleSave}
                type="button"
              >
                <Save size={16} aria-hidden="true" />
                {isSaving ? "Saving..." : "Save brief"}
              </SecondaryButton>
              <PrimaryButton
                disabled={isBusy}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
