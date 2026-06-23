"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { BlogRefreshLauncher } from "./BlogRefreshLauncher";
import { BlogZipButton } from "./BlogZipButton";
import { PrimaryButton } from "./PrimaryButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import type { ApplyDiscoveryPlan } from "../types/ApplyDiscoveryPlan";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

type BlogEditorHeaderProps = {
  applyRefreshPlan: ApplyDiscoveryPlan;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  downloadBlog: BlogItem;
  isSaving: boolean;
  message: string;
  saveBlog: () => void;
  saveRefreshPlan: SaveDiscoveryPlan;
  workspaceSwitcher?: WorkspaceSwitcherState;
};

export const BlogEditorHeader = ({
  applyRefreshPlan,
  discoverBlogRefreshIdeas,
  downloadBlog,
  isSaving,
  message,
  saveBlog,
  saveRefreshPlan,
  workspaceSwitcher,
}: BlogEditorHeaderProps) => {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-black"
            href="/blogs"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Blogs
          </Link>
          {workspaceSwitcher ? (
            <WorkspaceSwitcher {...workspaceSwitcher} />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {message ? (
            <span className="text-sm font-medium text-black">{message}</span>
          ) : null}
          <BlogRefreshLauncher
            applyPlan={applyRefreshPlan}
            blog={downloadBlog}
            discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
            savePlan={saveRefreshPlan}
          />
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
