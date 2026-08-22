"use client";

import { WorkspaceShell } from "./WorkspaceShell";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type SignedOutWorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const SignedOutWorkspaceView = ({
  initialMode,
}: SignedOutWorkspaceViewProps) => {
  return (
    <WorkspaceShell mode={initialMode} setMode={() => undefined}>
      <section className="rounded-lg border border-black bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Sign in to start writing</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black">
          Your product scan, saved topics, drafts, and exports live in your
          workspace.
        </p>
      </section>
    </WorkspaceShell>
  );
};
