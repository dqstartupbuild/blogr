"use client";

import { useEffect, useMemo, useState } from "react";
import { BlogList } from "./BlogList";
import { BlogStatusFilterTabs } from "./BlogStatusFilterTabs";
import { EmptyState } from "./EmptyState";
import { filterBlogsByStatus } from "../utils/filterBlogsByStatus";
import type { BlogItem } from "../types/BlogItem";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type FilteredBlogListProps = {
  blogs: BlogItem[];
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  savePlan: SaveDiscoveryPlan;
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const FilteredBlogList = ({
  blogs,
  discoverBlogRefreshIdeas,
  savePlan,
  selectedBlogId,
  setSelectedBlogId,
}: FilteredBlogListProps) => {
  const [activeFilter, setActiveFilter] = useState<BlogStatusFilter>("all");
  const filteredBlogs = useMemo(
    () => filterBlogsByStatus(blogs, activeFilter),
    [activeFilter, blogs],
  );

  useEffect(() => {
    if (filteredBlogs.length === 0) {
      return;
    }

    if (filteredBlogs.some((blog) => blog.id === selectedBlogId)) {
      return;
    }

    setSelectedBlogId(filteredBlogs[0].id);
  }, [filteredBlogs, selectedBlogId, setSelectedBlogId]);

  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <>
      <BlogStatusFilterTabs
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />
      {filteredBlogs.length > 0 ? (
        <BlogList
          blogs={filteredBlogs}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          savePlan={savePlan}
          selectedBlogId={selectedBlogId}
          setSelectedBlogId={setSelectedBlogId}
        />
      ) : (
        <EmptyState label="No blogs in this view." />
      )}
    </>
  );
};
