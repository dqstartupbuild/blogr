import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

type WorkspaceSidebarWorkspaceCardProps = {
  variant?: "card" | "compact";
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const WorkspaceSidebarWorkspaceCard = ({
  variant = "card",
  workspaceSwitcher,
}: WorkspaceSidebarWorkspaceCardProps) => {
  if (!workspaceSwitcher) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className="min-w-0 flex-1">
        <WorkspaceSwitcher isCompact {...workspaceSwitcher} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/15 bg-white p-3">
      <p className="mb-2 text-xs font-semibold text-black/60">Product</p>
      <WorkspaceSwitcher {...workspaceSwitcher} />
    </div>
  );
};
