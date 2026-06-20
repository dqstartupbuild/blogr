"use client";

import { WorkspaceContent } from "./WorkspaceContent";
import { useLiveWorkspace } from "../hooks/useLiveWorkspace";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceContentProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceContent = ({
  initialMode,
}: LiveWorkspaceContentProps) => {
  const workspace = useLiveWorkspace(initialMode);

  return <WorkspaceContent {...workspace} />;
};
