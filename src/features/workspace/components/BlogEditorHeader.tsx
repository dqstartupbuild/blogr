"use client";

import Link from "next/link";
import { ArrowLeft, Download, Save } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryAnchor } from "./SecondaryAnchor";

type BlogEditorHeaderProps = {
  blogId: string;
  isSaving: boolean;
  message: string;
  saveBlog: () => void;
};

export const BlogEditorHeader = ({
  blogId,
  isSaving,
  message,
  saveBlog,
}: BlogEditorHeaderProps) => {
  return (
    <header className="border-b border-[#ded8ca] bg-[#fffdf8]">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#324039]"
          href="/blogs"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Blogs
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {message ? (
            <span className="text-sm font-medium text-[#66736b]">{message}</span>
          ) : null}
          <SecondaryAnchor href={`/api/blogs/${blogId}/download`}>
            <Download size={16} aria-hidden="true" />
            Zip
          </SecondaryAnchor>
          <PrimaryButton disabled={isSaving} onClick={saveBlog} type="button">
            <Save size={16} aria-hidden="true" />
            {isSaving ? "Saving" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </header>
  );
};
