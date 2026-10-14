"use client";

import { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import type { TopicItem } from "../types/TopicItem";

type TopicRepurposeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onRepurpose: (sourceText: string) => Promise<void> | void;
  topic: TopicItem;
};

export const TopicRepurposeDialog = ({
  isOpen,
  onClose,
  onRepurpose,
  topic,
}: TopicRepurposeDialogProps) => {
  const [sourceText, setSourceText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedSourceText = sourceText.trim();
  const canSubmit = trimmedSourceText.length > 0 && !isSubmitting;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <form
        aria-modal="true"
        className="grid max-h-full w-full max-w-2xl gap-4 overflow-auto rounded-lg border border-black bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();

          if (!canSubmit) {
            return;
          }

          setIsSubmitting(true);
          void Promise.resolve(onRepurpose(trimmedSourceText))
            .then(() => {
              setSourceText("");
              onClose();
            })
            .catch(() => undefined)
            .finally(() => {
              setIsSubmitting(false);
            });
        }}
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black">
            Repurpose into a blog
          </h2>
          <p className="text-sm text-black">
            Paste the original piece, and the writer will turn it into a fresh
            post for {topic.keyword}.
          </p>
        </div>
        <label
          className="grid gap-2 text-sm font-medium text-black"
          htmlFor={`repurpose-source-${topic.id}`}
        >
          <span>Original text</span>
          <textarea
            className="min-h-72 resize-y rounded-md border border-black bg-white px-3 py-3 text-sm text-black outline-none transition placeholder:text-black focus:border-black"
            id={`repurpose-source-${topic.id}`}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Paste a blog, case study, notes, transcript, or draft."
            value={sourceText}
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={!canSubmit} type="submit">
            {isSubmitting ? "Starting..." : "Repurpose blog"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
