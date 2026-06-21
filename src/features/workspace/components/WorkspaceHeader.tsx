import { PenLine } from "lucide-react";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

type WorkspaceHeaderProps = {
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const WorkspaceHeader = ({ workspaceSwitcher }: WorkspaceHeaderProps) => {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-black bg-black text-white">
            <PenLine size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-semibold">Blogger</p>
            <p className="text-sm text-black">Long posts, clean exports.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {workspaceSwitcher ? (
            <WorkspaceSwitcher {...workspaceSwitcher} />
          ) : null}
          <AuthActions />
        </div>
      </div>
    </header>
  );
};
