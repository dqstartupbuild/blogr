"use client";

import { BlogEditorView } from "./BlogEditorView";
import { useLiveWorkspaceSwitcher } from "../hooks/useLiveWorkspaceSwitcher";

type LiveBlogEditorContentProps = {
  blogId: string;
};

export const LiveBlogEditorContent = ({
  blogId,
}: LiveBlogEditorContentProps) => {
  const workspaceSwitcher = useLiveWorkspaceSwitcher();

  return (
    <BlogEditorView
      activeWorkspaceId={workspaceSwitcher.activeWorkspaceId}
      blogId={blogId}
      forceDemo={false}
      workspaceSwitcher={workspaceSwitcher}
    />
  );
};
