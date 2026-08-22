"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { LiveWorkspaceContent } from "./LiveWorkspaceContent";
import { LiveWorkspaceLoadingView } from "./LiveWorkspaceLoadingView";
import { SignedOutWorkspaceView } from "./SignedOutWorkspaceView";
import { WorkspaceConnectionIssueView } from "./WorkspaceConnectionIssueView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type LiveWorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const LiveWorkspaceView = ({ initialMode }: LiveWorkspaceViewProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isLoaded || isLoading) {
    return <LiveWorkspaceLoadingView initialMode={initialMode} />;
  }

  if (!isSignedIn) {
    return <SignedOutWorkspaceView initialMode={initialMode} />;
  }

  if (!isAuthenticated) {
    return <WorkspaceConnectionIssueView initialMode={initialMode} />;
  }

  return <LiveWorkspaceContent initialMode={initialMode} />;
};
