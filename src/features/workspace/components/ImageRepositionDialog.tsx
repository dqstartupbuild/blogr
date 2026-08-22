"use client";

import { useId, useState } from "react";
import { GripVertical, MoveVertical } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

type ImageRepositionDialogProps = {
  alt: string;
  currentSectionHeading: string;
  error?: string;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onMove: (sectionHeading: string) => Promise<void> | void;
  sectionHeadings: string[];
};

export const ImageRepositionDialog = ({
  alt,
  currentSectionHeading,
  error,
  isOpen,
  isSaving,
  onClose,
  onMove,
  sectionHeadings,
}: ImageRepositionDialogProps) => {
  const titleId = useId();
  const [selectedHeading, setSelectedHeading] = useState(
    currentSectionHeading || sectionHeadings[0] || "",
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="grid max-h-full w-full max-w-2xl gap-4 overflow-auto rounded-lg border border-black bg-white p-5"
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black" id={titleId}>
            Move image
          </h2>
          <p className="text-sm leading-6 text-black/60">
            Drag the image to a section. It will sit under that heading without
            breaking up the section content.
          </p>
        </div>
        {sectionHeadings.length > 0 ? (
          <div className="grid gap-2">
            {sectionHeadings.map((heading) => {
              const isSelected = selectedHeading === heading;

              return (
                <div
                  className={`grid gap-2 rounded-md border p-3 transition ${
                    isSelected
                      ? "border-black bg-black/[0.04]"
                      : "border-black/10 bg-white"
                  }`}
                  key={heading}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    setSelectedHeading(heading);
                  }}
                >
                  <p className="text-sm font-semibold text-black">{heading}</p>
                  {isSelected ? (
                    <button
                      className="flex cursor-grab items-center gap-2 rounded-md border border-black/15 bg-white p-3 text-left text-sm text-black active:cursor-grabbing"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", heading);
                      }}
                      type="button"
                    >
                      <GripVertical size={17} aria-hidden="true" />
                      <span className="line-clamp-2">{alt || "Article image"}</span>
                    </button>
                  ) : (
                    <button
                      className="rounded-md border border-dashed border-black/20 px-3 py-2 text-left text-xs font-medium text-black/60 hover:border-black hover:text-black"
                      onClick={() => setSelectedHeading(heading)}
                      type="button"
                    >
                      Move here
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-md border border-black/10 bg-black/[0.03] p-3 text-sm text-black/60">
            Add section headings to the article before moving this image.
          </p>
        )}
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isSaving} onClick={onClose} type="button">
            Cancel
          </SecondaryButton>
          <PrimaryButton
            disabled={!selectedHeading || isSaving}
            onClick={() =>
              void Promise.resolve(onMove(selectedHeading)).catch(() => undefined)
            }
            type="button"
          >
            <MoveVertical size={16} aria-hidden="true" />
            {isSaving ? "Moving..." : "Move image"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
