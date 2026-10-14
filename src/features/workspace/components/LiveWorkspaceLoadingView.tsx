"use client";

import { WorkspaceShell } from "./WorkspaceShell";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceLoadingViewProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceLoadingView = ({
  initialMode,
}: LiveWorkspaceLoadingViewProps) => {
  return (
    <WorkspaceShell mode={initialMode} setMode={() => undefined}>
      <section className="rounded-lg border border-black bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Loading your workspace</h2>
        <p className="mt-2 text-sm text-black">One moment.</p>
      </section>
    </WorkspaceShell>
  );
};
