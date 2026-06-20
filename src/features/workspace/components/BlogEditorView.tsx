"use client";

import { BlogEditorFields } from "./BlogEditorFields";
import { BlogEditorHeader } from "./BlogEditorHeader";
import { BlogEditorPreview } from "./BlogEditorPreview";
import { useBlogEditor } from "../hooks/useBlogEditor";

type BlogEditorViewProps = {
  blogId: string;
};

export const BlogEditorView = ({ blogId }: BlogEditorViewProps) => {
  const editor = useBlogEditor(blogId);

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1d2320]">
      <BlogEditorHeader
        blogId={blogId}
        isSaving={editor.isSaving}
        message={editor.message}
        saveBlog={editor.saveBlog}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <BlogEditorFields state={editor.state} updateField={editor.updateField} />
        <BlogEditorPreview state={editor.state} />
      </main>
    </div>
  );
};
