"use client";

import Link from "next/link";
import { FileText, ListChecks } from "lucide-react";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceTabsProps = {
  mode: WorkspaceViewMode;
  setMode: (mode: WorkspaceViewMode) => void;
};

export const WorkspaceTabs = ({ mode, setMode }: WorkspaceTabsProps) => {
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Workspace">
      <Link
        className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium ${
          mode === "topics"
            ? "border-black bg-black text-white"
            : "border-black bg-white text-black"
        }`}
        href="/"
        onClick={() => setMode("topics")}
      >
        <ListChecks size={16} aria-hidden="true" />
        Topics
      </Link>
      <Link
        className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium ${
          mode === "blogs"
            ? "border-black bg-black text-white"
            : "border-black bg-white text-black"
        }`}
        href="/blogs"
        onClick={() => setMode("blogs")}
      >
        <FileText size={16} aria-hidden="true" />
        Blogs
      </Link>
    </nav>
  );
};
