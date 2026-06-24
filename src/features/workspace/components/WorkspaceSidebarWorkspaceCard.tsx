import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

type WorkspaceSidebarWorkspaceCardProps = {
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const WorkspaceSidebarWorkspaceCard = ({
  workspaceSwitcher,
}: WorkspaceSidebarWorkspaceCardProps) => {
  if (!workspaceSwitcher) {
    return null;
  }

  return (
    <div className="rounded-lg border border-black/15 bg-white p-3">
      <p className="mb-2 text-xs font-semibold text-black/60">Product</p>
      <WorkspaceSwitcher {...workspaceSwitcher} />
    </div>
  );
};
