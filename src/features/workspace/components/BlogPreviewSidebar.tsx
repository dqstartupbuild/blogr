"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { BlogPreviewPanel } from "./BlogPreviewPanel";
import type { BlogItem } from "../types/BlogItem";

type BlogPreviewSidebarProps = {
  blog?: BlogItem;
};

export const BlogPreviewSidebar = ({ blog }: BlogPreviewSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonLabel = isOpen ? "Close preview" : "Preview";

  return (
    <>
      <button
        aria-controls="workspace-blog-preview-sidebar"
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-40 hidden h-11 items-center justify-center gap-2 rounded-md border border-black bg-black px-4 text-sm font-semibold text-white shadow-lg transition hover:bg-white hover:text-black sm:inline-flex"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? (
          <X size={16} aria-hidden="true" />
        ) : (
          <Eye size={16} aria-hidden="true" />
        )}
        {buttonLabel}
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close preview"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[1120px] flex-col border-l border-black/10 bg-white shadow-2xl"
            id="workspace-blog-preview-sidebar"
          >
            <div className="flex items-center justify-end border-b border-black/10 px-4 py-3">
              <button
                aria-label="Close preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-white text-black transition hover:border-black hover:bg-black hover:text-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <BlogPreviewPanel blog={blog} variant="drawer" />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
};
