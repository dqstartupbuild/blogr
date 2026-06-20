"use client";

import { WorkspaceContent } from "./WorkspaceContent";
import { useLiveWorkspace } from "../hooks/useLiveWorkspace";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceView = ({ initialMode }: LiveWorkspaceViewProps) => {
  const workspace = useLiveWorkspace(initialMode);

  return <WorkspaceContent {...workspace} />;
};
