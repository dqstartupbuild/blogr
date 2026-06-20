"use client";

import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { DemoWorkspaceView } from "./DemoWorkspaceView";
import { LiveWorkspaceView } from "./LiveWorkspaceView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const WorkspaceView = ({ initialMode }: WorkspaceViewProps) => {
  if (isLiveWorkspaceEnabled()) {
    return <LiveWorkspaceView initialMode={initialMode} />;
  }

  return <DemoWorkspaceView initialMode={initialMode} />;
};
