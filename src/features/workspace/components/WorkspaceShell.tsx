"use client";

import type { ReactNode } from "react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceTabs } from "./WorkspaceTabs";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceShellProps = {
  children: ReactNode;
  mode: WorkspaceViewMode;
  setMode: (mode: WorkspaceViewMode) => void;
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const WorkspaceShell = ({
  children,
  mode,
  setMode,
  workspaceSwitcher,
}: WorkspaceShellProps) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <WorkspaceHeader workspaceSwitcher={workspaceSwitcher} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <WorkspaceTabs mode={mode} setMode={setMode} />
        {children}
      </div>
    </div>
  );
};
