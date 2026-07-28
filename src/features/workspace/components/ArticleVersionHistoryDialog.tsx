"use client";

import { useEffect } from "react";
import { ArticleVersionHistoryContent } from "./ArticleVersionHistoryContent";
import { SecondaryButton } from "./SecondaryButton";
import type { BlogItem } from "../types/BlogItem";

type ArticleVersionHistoryDialogProps = {
  blog: BlogItem;
  canLoadVersions: boolean;
  onClose: () => void;
};

export const ArticleVersionHistoryDialog = ({
  blog,
  canLoadVersions,
  onClose,
}: ArticleVersionHistoryDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/45 px-3 py-6 sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="article-version-history-title"
        aria-modal="true"
        className="w-full max-w-6xl overflow-hidden rounded-lg bg-white"
        role="dialog"
      >
        <header className="flex flex-col gap-4 border-b border-black/10 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h2
              className="text-xl font-semibold text-black"
              id="article-version-history-title"
            >
              Version history
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-black/60">
              Read any earlier draft. Viewing an old version will not change your
              current article.
            </p>
          </div>
          <SecondaryButton onClick={onClose} type="button">
            Close
          </SecondaryButton>
        </header>
        <div className="max-h-[calc(100dvh-11rem)] min-w-0 overflow-y-auto px-4 py-5 sm:px-6">
          {canLoadVersions ? (
            <ArticleVersionHistoryContent blog={blog} />
          ) : (
            <div className="py-10 text-center">
              <p className="text-base font-semibold text-black">
                No older versions yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/60">
                Older versions will appear here after this article is rewritten
                in a connected workspace.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
