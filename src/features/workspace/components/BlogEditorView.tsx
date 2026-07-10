"use client";

import { BlogEditorFields } from "./BlogEditorFields";
import { BlogEditorHeader } from "./BlogEditorHeader";
import { BlogEditorPreview } from "./BlogEditorPreview";
import { BlogPreviewSidebar } from "./BlogPreviewSidebar";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
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
    <div className="min-h-screen bg-white text-black lg:flex">
      <WorkspaceSidebar
        mode="blogs"
        setMode={() => undefined}
        workspaceSwitcher={workspaceSwitcher}
      />
      <main className="min-w-0 flex-1">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <BlogEditorHeader
            downloadBlog={downloadBlog}
            isSaving={editor.isSaving}
            message={editor.message}
            saveBlog={editor.saveBlog}
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <BlogEditorFields
              images={downloadBlog.images}
              state={editor.state}
              updateField={editor.updateField}
            />
            <BlogEditorPreview
              blog={downloadBlog}
              regenerateImage={editor.regenerateImage}
              updateBlogImages={editor.updateBlogImages}
            />
          </div>
          <BlogPreviewSidebar
            blog={downloadBlog}
            regenerateImage={editor.regenerateImage}
            updateBlogImages={editor.updateBlogImages}
          />
        </div>
      </main>
    </div>
  );
};
