"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { BlogEditorConnectionIssueView } from "./BlogEditorConnectionIssueView";
import { BlogEditorLoadingView } from "./BlogEditorLoadingView";
import { BlogEditorView } from "./BlogEditorView";
import { SignedOutBlogEditorView } from "./SignedOutBlogEditorView";

type LiveBlogEditorViewProps = {
  blogId: string;
};

export const LiveBlogEditorView = ({ blogId }: LiveBlogEditorViewProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isLoaded || isLoading) {
    return <BlogEditorLoadingView />;
  }

  if (!isSignedIn) {
    return <SignedOutBlogEditorView />;
  }

  if (!isAuthenticated) {
    return <BlogEditorConnectionIssueView />;
  }

  return <BlogEditorView blogId={blogId} forceDemo={false} />;
};
