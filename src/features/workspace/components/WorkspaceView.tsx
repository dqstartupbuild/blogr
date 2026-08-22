"use client";

import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { DemoWorkspaceView } from "./DemoWorkspaceView";
import { LiveWorkspaceView } from "./LiveWorkspaceView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceViewProps = {
  forceDemo: boolean;
  initialMode: WorkspaceViewMode;
};

export const WorkspaceView = ({
  forceDemo,
  initialMode,
}: WorkspaceViewProps) => {
  if (!forceDemo && isLiveWorkspaceEnabled()) {
    return <LiveWorkspaceView initialMode={initialMode} />;
  }

  return <DemoWorkspaceView initialMode={initialMode} />;
};
