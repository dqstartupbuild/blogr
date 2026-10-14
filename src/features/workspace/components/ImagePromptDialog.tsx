"use client";

import { useId } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

type ImagePromptDialogProps = {
  error?: string;
  isOpen: boolean;
  isRegenerating: boolean;
  onClose: () => void;
  onPromptChange: (prompt: string) => void;
  onRegenerate: (prompt: string) => Promise<void> | void;
  prompt: string;
};

export const ImagePromptDialog = ({
  error,
  isOpen,
  isRegenerating,
  onClose,
  onPromptChange,
  onRegenerate,
  prompt,
}: ImagePromptDialogProps) => {
  const titleId = useId();
  const promptId = useId();
  const trimmedPrompt = prompt.trim();
  const canRegenerate = trimmedPrompt.length > 0 && !isRegenerating;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="grid max-h-full w-full max-w-2xl gap-4 overflow-auto rounded-lg border border-black bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();

          if (!canRegenerate) {
            return;
          }

          void Promise.resolve(onRegenerate(trimmedPrompt)).catch(() => undefined);
        }}
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black" id={titleId}>
            Edit image prompt
          </h2>
          <p className="text-sm text-black">
            Describe what you want to see. The next image will follow this.
          </p>
        </div>
        <label
          className="grid gap-2 text-sm font-semibold text-black"
          htmlFor={promptId}
        >
          Image prompt
          <textarea
            className="min-h-52 resize-y rounded-md border border-black bg-white p-3 text-sm font-normal leading-6 text-black outline-none transition focus:ring-2 focus:ring-black"
            id={promptId}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the image you want."
            value={prompt}
          />
        </label>
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton
            disabled={isRegenerating}
            onClick={onClose}
            type="button"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={!canRegenerate} type="submit">
            {isRegenerating ? (
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
            ) : (
              <RefreshCw size={16} aria-hidden="true" />
            )}
            {isRegenerating ? "Regenerating..." : "Regenerate image"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
