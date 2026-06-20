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
    <section className="space-y-4 rounded-lg border border-black bg-white p-4">
      <TextField
        id="blog-title"
        label="Title"
        onChange={(event) => updateField("title", event.target.value)}
        value={state.title}
      />
      <label className="grid gap-2 text-sm font-medium text-black" htmlFor="blog-excerpt">
        <span>Summary</span>
        <textarea
          className="min-h-24 rounded-md border border-black bg-white px-3 py-3 text-sm text-black outline-none transition placeholder:text-black focus:border-black"
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
