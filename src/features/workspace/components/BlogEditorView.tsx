"use client";

import { BlogEditorFields } from "./BlogEditorFields";
import { BlogEditorHeader } from "./BlogEditorHeader";
import { BlogEditorPreview } from "./BlogEditorPreview";
import { buildEditorDownloadBlog } from "../mappers/buildEditorDownloadBlog";
import { useBlogEditor } from "../hooks/useBlogEditor";

type BlogEditorViewProps = {
  blogId: string;
  forceDemo: boolean;
};

export const BlogEditorView = ({ blogId, forceDemo }: BlogEditorViewProps) => {
  const editor = useBlogEditor({ blogId, forceDemo });
  const downloadBlog = buildEditorDownloadBlog({
    baseBlog: editor.blog,
    blogId,
    state: editor.state,
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <BlogEditorHeader
        downloadBlog={downloadBlog}
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
