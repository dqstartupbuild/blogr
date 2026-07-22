"use client";

import { applyBlogMdxEditorValue } from "../utils/applyBlogMdxEditorValue";
import { getBlogMdxEditorValue } from "../utils/getBlogMdxEditorValue";
import type { BlogImageItem } from "../types/BlogImageItem";

type BlogMdxTextareaProps = {
  images: BlogImageItem[];
  mdx: string;
  title: string;
  updateMdx: (value: string) => void;
};

export const BlogMdxTextarea = ({
  images,
  mdx,
  title,
  updateMdx,
}: BlogMdxTextareaProps) => {
  const editorValue = getBlogMdxEditorValue(mdx, images);

  return (
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor="blog-mdx">
      <span>Article body</span>
      <textarea
        className="min-h-[560px] w-full min-w-0 max-w-full rounded-md border border-black/15 bg-white px-3 py-3 font-mono text-sm leading-6 text-black outline-none transition placeholder:text-black/45 focus:border-black"
        id="blog-mdx"
        onChange={(event) =>
          updateMdx(
            applyBlogMdxEditorValue({
              currentMdx: mdx,
              editableMdx: event.target.value,
              images,
              title,
            }),
          )
        }
        spellCheck={false}
        value={editorValue}
      />
      <span className="text-xs font-normal leading-5 text-black/60">
        Article images are managed from the preview, so their links stay out of
        the text editor.
      </span>
    </label>
  );
};
