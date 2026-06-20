"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { BlogZipButton } from "./BlogZipButton";
import { PrimaryButton } from "./PrimaryButton";
import type { BlogItem } from "../types/BlogItem";

type BlogEditorHeaderProps = {
  downloadBlog: BlogItem;
  isSaving: boolean;
  message: string;
  saveBlog: () => void;
};

export const BlogEditorHeader = ({
  downloadBlog,
  isSaving,
  message,
  saveBlog,
}: BlogEditorHeaderProps) => {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-black"
          href="/blogs"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Blogs
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {message ? (
            <span className="text-sm font-medium text-black">{message}</span>
          ) : null}
          <BlogZipButton blog={downloadBlog} />
          <PrimaryButton disabled={isSaving} onClick={saveBlog} type="button">
            <Save size={16} aria-hidden="true" />
            {isSaving ? "Saving" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </header>
  );
};
