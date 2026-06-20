"use client";

import { BlogMdxTextarea } from "./BlogMdxTextarea";
import { TextField } from "./TextField";
import type { BlogEditorState } from "../types/BlogEditorState";

type BlogEditorFieldsProps = {
  state: BlogEditorState;
  updateField: (field: keyof BlogEditorState, value: string) => void;
};

export const BlogEditorFields = ({
  state,
  updateField,
}: BlogEditorFieldsProps) => {
  return (
    <section className="space-y-4 rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm">
      <TextField
        id="blog-title"
        label="Title"
        onChange={(event) => updateField("title", event.target.value)}
        value={state.title}
      />
      <label className="grid gap-2 text-sm font-medium text-[#324039]" htmlFor="blog-excerpt">
        <span>Summary</span>
        <textarea
          className="min-h-24 rounded-md border border-[#cfc7b8] bg-white px-3 py-3 text-sm outline-none transition placeholder:text-[#8b938e] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15"
          id="blog-excerpt"
          onChange={(event) => updateField("excerpt", event.target.value)}
          value={state.excerpt}
        />
      </label>
      <BlogMdxTextarea
        mdx={state.mdx}
        updateMdx={(value) => updateField("mdx", value)}
      />
    </section>
  );
};
