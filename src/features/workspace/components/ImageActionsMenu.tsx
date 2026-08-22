"use client";

import { useState } from "react";
import {
  EllipsisVertical,
  ImageOff,
  MoveVertical,
  Pencil,
  RefreshCw,
  Star,
} from "lucide-react";

type ImageActionsMenuProps = {
  isBusy: boolean;
  onEditAlt?: () => void;
  onMakeFeature?: () => void;
  onMove?: () => void;
  onRegenerate?: () => void;
  onRemove?: () => void;
};

export const ImageActionsMenu = ({
  isBusy,
  onEditAlt,
  onMakeFeature,
  onMove,
  onRegenerate,
  onRemove,
}: ImageActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const runAction = (action?: () => void) => {
    setIsOpen(false);
    action?.();
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Image actions"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/20 bg-white text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isBusy}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <EllipsisVertical size={17} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 top-11 z-20 grid min-w-48 overflow-hidden rounded-md border border-black bg-white p-1 shadow-xl"
          role="menu"
        >
          {onRegenerate ? (
            <button
              className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-black hover:bg-black/5"
              onClick={() => runAction(onRegenerate)}
              role="menuitem"
              type="button"
            >
              <RefreshCw size={15} aria-hidden="true" />
              Regenerate
            </button>
          ) : null}
          {onEditAlt ? (
            <button
              className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-black hover:bg-black/5"
              onClick={() => runAction(onEditAlt)}
              role="menuitem"
              type="button"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit alt text
            </button>
          ) : null}
          {onMove ? (
            <button
              className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-black hover:bg-black/5"
              onClick={() => runAction(onMove)}
              role="menuitem"
              type="button"
            >
              <MoveVertical size={15} aria-hidden="true" />
              Move in article
            </button>
          ) : null}
          {onMakeFeature ? (
            <button
              className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-black hover:bg-black/5"
              onClick={() => runAction(onMakeFeature)}
              role="menuitem"
              type="button"
            >
              <Star size={15} aria-hidden="true" />
              Make feature image
            </button>
          ) : null}
          {onRemove ? (
            <button
              className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
              onClick={() => runAction(onRemove)}
              role="menuitem"
              type="button"
            >
              <ImageOff size={15} aria-hidden="true" />
              Remove image
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
