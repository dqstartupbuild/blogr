"use client";

import type { ReactNode } from "react";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
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
    <div className="min-h-screen bg-white text-black lg:flex">
      <WorkspaceSidebar
        mode={mode}
        setMode={setMode}
        workspaceSwitcher={workspaceSwitcher}
      />
      <main className="min-w-0 flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
};
