"use client";
import { LiveBlogEditorContent } from "./LiveBlogEditorContent";
import { BlogEditorLoadingView } from "./BlogEditorLoadingView";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";
export const LiveBlogEditorView = ({ blogId }: { blogId: string }) => {
  const { state } = useLocalWorkspace();
  return state ? <LiveBlogEditorContent blogId={blogId} /> : <BlogEditorLoadingView />;
};
