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
    <aside className="border-b border-black/10 bg-white px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-5">
      <WorkspaceLogo />
      <nav
        aria-label="Workspace"
        className="mt-6 grid gap-1 sm:grid-cols-4 lg:grid-cols-1"
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
      <div className="mt-5 border-t border-black/10 pt-5 lg:mt-auto">
        <WorkspaceSidebarWorkspaceCard workspaceSwitcher={workspaceSwitcher} />
        <div className="mt-3 flex justify-start">
          <AuthActions />
        </div>
      </div>
    </aside>
  );
};
