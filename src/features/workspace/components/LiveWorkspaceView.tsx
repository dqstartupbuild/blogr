"use client";
import { LiveWorkspaceContent } from "./LiveWorkspaceContent";
import { LiveWorkspaceLoadingView } from "./LiveWorkspaceLoadingView";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
export const LiveWorkspaceView = ({ initialMode }: { initialMode: WorkspaceViewMode }) => {
  const { state } = useLocalWorkspace();
  return state ? <LiveWorkspaceContent initialMode={initialMode} /> : <LiveWorkspaceLoadingView initialMode={initialMode} />;
};
