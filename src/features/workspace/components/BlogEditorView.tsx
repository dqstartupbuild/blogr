"use client";

import { BlogEditorFields } from "./BlogEditorFields";
import { BlogEditorHeader } from "./BlogEditorHeader";
import { BlogEditorPreview } from "./BlogEditorPreview";
import { buildEditorDownloadBlog } from "../mappers/buildEditorDownloadBlog";
import { useBlogEditor } from "../hooks/useBlogEditor";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

type BlogEditorViewProps = {
  activeWorkspaceId?: string;
  blogId: string;
  forceDemo: boolean;
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const BlogEditorView = ({
  activeWorkspaceId,
  blogId,
  forceDemo,
  workspaceSwitcher,
}: BlogEditorViewProps) => {
  const editor = useBlogEditor({ activeWorkspaceId, blogId, forceDemo });
  const downloadBlog = buildEditorDownloadBlog({
    baseBlog: editor.blog,
    blogId,
    state: editor.state,
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <BlogEditorHeader
        applyRefreshPlan={editor.applyRefreshPlan}
        discoverBlogRefreshIdeas={editor.discoverBlogRefreshIdeas}
        downloadBlog={downloadBlog}
        isSaving={editor.isSaving}
        message={editor.message}
        saveBlog={editor.saveBlog}
        saveRefreshPlan={editor.saveRefreshPlan}
        workspaceSwitcher={workspaceSwitcher}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <BlogEditorFields state={editor.state} updateField={editor.updateField} />
        <BlogEditorPreview state={editor.state} />
      </main>
    </div>
  );
};
