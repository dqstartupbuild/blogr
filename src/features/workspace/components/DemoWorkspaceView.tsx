"use client";

import { WorkspaceContent } from "./WorkspaceContent";
import { useDemoWorkspace } from "../hooks/useDemoWorkspace";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type DemoWorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const DemoWorkspaceView = ({ initialMode }: DemoWorkspaceViewProps) => {
  const workspace = useDemoWorkspace(initialMode);

  return <WorkspaceContent {...workspace} />;
};
