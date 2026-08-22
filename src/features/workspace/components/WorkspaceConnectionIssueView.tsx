"use client";

import { WorkspaceShell } from "./WorkspaceShell";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceConnectionIssueViewProps = {
  initialMode: WorkspaceViewMode;
};

export const WorkspaceConnectionIssueView = ({
  initialMode,
}: WorkspaceConnectionIssueViewProps) => {
  return (
    <WorkspaceShell mode={initialMode} setMode={() => undefined}>
      <section className="rounded-lg border border-black bg-white p-6">
        <h2 className="text-lg font-semibold text-black">
          We could not open your workspace
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black">
          You are signed in, but your workspace did not connect yet. Try signing
          out and back in.
        </p>
      </section>
    </WorkspaceShell>
  );
};
