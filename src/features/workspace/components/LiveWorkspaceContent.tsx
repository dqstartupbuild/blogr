"use client";

import { WorkspaceContent } from "./WorkspaceContent";
import { useLiveWorkspace } from "../hooks/useLiveWorkspace";
import { useLiveWorkspaceSwitcher } from "../hooks/useLiveWorkspaceSwitcher";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceContentProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceContent = ({
  initialMode,
}: LiveWorkspaceContentProps) => {
  const workspaceSwitcher = useLiveWorkspaceSwitcher();
  const workspace = useLiveWorkspace(initialMode, workspaceSwitcher);

  return <WorkspaceContent {...workspace} />;
};
