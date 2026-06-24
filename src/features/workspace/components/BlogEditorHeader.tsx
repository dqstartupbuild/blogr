"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { BlogPublishButton } from "./BlogPublishButton";
import { BlogRefreshLauncher } from "./BlogRefreshLauncher";
import { BlogZipButton } from "./BlogZipButton";
import { PrimaryButton } from "./PrimaryButton";
import type { ApplyDiscoveryPlan } from "../types/ApplyDiscoveryPlan";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogEditorHeaderProps = {
  applyRefreshPlan: ApplyDiscoveryPlan;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  downloadBlog: BlogItem;
  isSaving: boolean;
  message: string;
  saveBlog: () => void;
  saveRefreshPlan: SaveDiscoveryPlan;
};

export const BlogEditorHeader = ({
  applyRefreshPlan,
  discoverBlogRefreshIdeas,
  downloadBlog,
  isSaving,
  message,
  saveBlog,
  saveRefreshPlan,
}: BlogEditorHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-black"
          href="/blogs"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Articles
        </Link>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-black">
          Edit Article
        </h1>
        <p className="mt-2 line-clamp-2 text-base leading-7 text-black/65">
          {downloadBlog.title}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {message ? (
          <span className="text-sm font-medium text-black">{message}</span>
        ) : null}
        <BlogRefreshLauncher
          applyPlan={applyRefreshPlan}
          blog={downloadBlog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          savePlan={saveRefreshPlan}
        />
        <BlogPublishButton blog={downloadBlog} />
        <BlogZipButton blog={downloadBlog} />
        <PrimaryButton disabled={isSaving} onClick={saveBlog} type="button">
          <Save size={16} aria-hidden="true" />
          {isSaving ? "Saving" : "Save"}
        </PrimaryButton>
      </div>
    </header>
  );
};
