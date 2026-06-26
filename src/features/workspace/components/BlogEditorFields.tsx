"use client";

import { BlogMdxTextarea } from "./BlogMdxTextarea";
import { TextField } from "./TextField";
import { metaDescriptionLengthLimits } from "@/config/metaDescriptionLengthLimits";
import { seoTitleLengthLimits } from "@/config/seoTitleLengthLimits";
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
    <section className="space-y-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <TextField
        id="blog-title"
        label="Article title"
        onChange={(event) => updateField("title", event.target.value)}
        value={state.title}
      />
      <TextField
        id="blog-seo-title"
        label="SEO title"
        onChange={(event) => updateField("seoTitle", event.target.value)}
        value={state.seoTitle}
      />
      <p className="text-xs leading-5 text-black/60">
        Use {seoTitleLengthLimits.min} to {seoTitleLengthLimits.max} characters.
        Current: {state.seoTitle.length}.
      </p>
      <label
        className="grid gap-2 text-sm font-medium text-black"
        htmlFor="blog-excerpt"
      >
        <span>Meta description</span>
        <textarea
          className="min-h-24 rounded-md border border-black/15 bg-white px-3 py-3 text-sm text-black outline-none transition placeholder:text-black/45 focus:border-black"
          id="blog-excerpt"
          onChange={(event) => updateField("excerpt", event.target.value)}
          value={state.excerpt}
        />
      </label>
      <p className="text-xs leading-5 text-black/60">
        Use {metaDescriptionLengthLimits.min} to {metaDescriptionLengthLimits.max}{" "}
        characters. Current: {state.excerpt.length}.
      </p>
      <BlogMdxTextarea
        mdx={state.mdx}
        updateMdx={(value) => updateField("mdx", value)}
      />
    </section>
  );
};
