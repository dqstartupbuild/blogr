"use client";

import { FileText, Home, ListChecks, Settings2 } from "lucide-react";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { WorkspaceLogo } from "./WorkspaceLogo";
import { WorkspaceSidebarLink } from "./WorkspaceSidebarLink";
import { WorkspaceSidebarWorkspaceCard } from "./WorkspaceSidebarWorkspaceCard";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceSidebarProps = {
  mode: WorkspaceViewMode;
  setMode: (mode: WorkspaceViewMode) => void;
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const WorkspaceSidebar = ({
  mode,
  setMode,
  workspaceSwitcher,
}: WorkspaceSidebarProps) => {
  return (
    <aside className="sticky top-0 z-40 border-b border-black/10 bg-white px-4 py-3 lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
      <div className="flex items-center justify-between gap-3 lg:block">
        <WorkspaceLogo />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:hidden">
          <WorkspaceSidebarWorkspaceCard
            variant="compact"
            workspaceSwitcher={workspaceSwitcher}
          />
          <AuthActions />
        </div>
      </div>
      <nav
        aria-label="Workspace"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-1 border-t border-black/10 bg-white px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:static lg:mt-6 lg:grid-cols-1 lg:border-t-0 lg:bg-transparent lg:p-0 lg:shadow-none"
      >
        <WorkspaceSidebarLink
          href="/"
          icon={Home}
          isActive={mode === "dashboard"}
          label="Dashboard"
          mode="dashboard"
          setMode={setMode}
        />
        <WorkspaceSidebarLink
          href="/topics"
          icon={ListChecks}
          isActive={mode === "topics"}
          label="Topics"
          mode="topics"
          setMode={setMode}
        />
        <WorkspaceSidebarLink
          href="/blogs"
          icon={FileText}
          isActive={mode === "blogs"}
          label="Articles"
          mode="blogs"
          setMode={setMode}
        />
        <WorkspaceSidebarLink
          href="/settings"
          icon={Settings2}
          isActive={mode === "settings"}
          label="Settings"
          mode="settings"
          setMode={setMode}
        />
      </nav>
      <div className="mt-5 hidden border-t border-black/10 pt-5 lg:mt-auto lg:block">
        <WorkspaceSidebarWorkspaceCard workspaceSwitcher={workspaceSwitcher} />
        <div className="mt-3 flex justify-start">
          <AuthActions />
        </div>
      </div>
    </aside>
  );
};
