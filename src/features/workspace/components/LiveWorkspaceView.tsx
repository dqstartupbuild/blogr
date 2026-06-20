"use client";

import { useAuth } from "@clerk/nextjs";
import { LiveWorkspaceContent } from "./LiveWorkspaceContent";
import { LiveWorkspaceLoadingView } from "./LiveWorkspaceLoadingView";
import { SignedOutWorkspaceView } from "./SignedOutWorkspaceView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceView = ({ initialMode }: LiveWorkspaceViewProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LiveWorkspaceLoadingView initialMode={initialMode} />;
  }

  if (!isSignedIn) {
    return <SignedOutWorkspaceView initialMode={initialMode} />;
  }

  return <LiveWorkspaceContent initialMode={initialMode} />;
};
