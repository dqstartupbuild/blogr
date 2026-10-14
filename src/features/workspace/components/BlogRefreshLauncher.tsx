"use client";

import { useState } from "react";
import { BlogRefreshButton } from "./BlogRefreshButton";
import { BlogRefreshDialog } from "./BlogRefreshDialog";
import type { ApplyDiscoveryPlan } from "../types/ApplyDiscoveryPlan";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type BlogRefreshLauncherProps = {
  applyPlan?: ApplyDiscoveryPlan;
  blog: BlogItem;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  savePlan?: SaveDiscoveryPlan;
};

export const BlogRefreshLauncher = ({
  applyPlan,
  blog,
  discoverBlogRefreshIdeas,
  savePlan,
}: BlogRefreshLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <BlogRefreshButton onOpen={() => setIsOpen(true)} />
      <BlogRefreshDialog
        applyPlan={applyPlan}
        blog={blog}
        discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
        isOpen={isOpen}
        key={`${blog.id}:${blog.keyword}:${blog.title}`}
        onClose={() => setIsOpen(false)}
        savePlan={savePlan}
      />
    </>
  );
};
