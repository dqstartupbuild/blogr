"use client";

import { useId, useState } from "react";
import { Save } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

type ImageAltTextDialogProps = {
  alt: string;
  error?: string;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (alt: string) => Promise<void> | void;
};

export const ImageAltTextDialog = ({
  alt,
  error,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: ImageAltTextDialogProps) => {
  const inputId = useId();
  const titleId = useId();
  const [draft, setDraft] = useState(alt);

  if (!isOpen) {
    return null;
  }

  const trimmedDraft = draft.trim();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="grid w-full max-w-lg gap-4 rounded-lg border border-black bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();

          if (trimmedDraft) {
            void Promise.resolve(onSave(trimmedDraft)).catch(() => undefined);
          }
        }}
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black" id={titleId}>
            Edit alt text
          </h2>
          <p className="text-sm leading-6 text-black/60">
            Describe what the image shows for people who cannot see it.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-black" htmlFor={inputId}>
          Alt text
          <textarea
            className="min-h-32 resize-y rounded-md border border-black bg-white p-3 text-sm font-normal leading-6 text-black outline-none focus:ring-2 focus:ring-black"
            id={inputId}
            onChange={(event) => setDraft(event.target.value)}
            value={draft}
          />
        </label>
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isSaving} onClick={onClose} type="button">
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={!trimmedDraft || isSaving} type="submit">
            <Save size={16} aria-hidden="true" />
            {isSaving ? "Saving..." : "Save alt text"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
