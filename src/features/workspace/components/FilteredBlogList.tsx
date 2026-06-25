"use client";

import { useMemo, useState } from "react";
import { BlogList } from "./BlogList";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterSelect } from "./FilterSelect";
import { SearchField } from "./SearchField";
import { blogStatusFilterOptions } from "../constants/blogStatusFilterOptions";
import { filterBlogsBySearch } from "../utils/filterBlogsBySearch";
import { filterBlogsByStatus } from "../utils/filterBlogsByStatus";
import { filterBlogsByTopic } from "../utils/filterBlogsByTopic";
import { getUniqueBlogTopics } from "../utils/getUniqueBlogTopics";
import type { BlogItem } from "../types/BlogItem";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type FilteredBlogListProps = {
  blogs: BlogItem[];
  deleteBlog: (blogId: string) => Promise<void> | void;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  savePlan: SaveDiscoveryPlan;
};

export const FilteredBlogList = ({
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
  savePlan,
}: FilteredBlogListProps) => {
  const [activeFilter, setActiveFilter] = useState<BlogStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const topicOptions = useMemo(
    () => [
      { label: "All topics", value: "all" },
      ...getUniqueBlogTopics(blogs).map((topic) => ({
        label: topic,
        value: topic,
      })),
    ],
    [blogs],
  );
  const filteredBlogs = useMemo(
    () =>
      filterBlogsBySearch(
        filterBlogsByTopic(filterBlogsByStatus(blogs, activeFilter), topicFilter),
        searchQuery,
      ),
    [activeFilter, blogs, searchQuery, topicFilter],
  );

  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <div className="space-y-4">
      <FilterBar>
        <SearchField
          label="Search articles"
          onChange={setSearchQuery}
          placeholder="Search articles..."
          value={searchQuery}
        />
        <FilterSelect
          label="Status"
          onChange={(value) => setActiveFilter(value as BlogStatusFilter)}
          options={blogStatusFilterOptions}
          value={activeFilter}
        />
        <FilterSelect
          label="Topic"
          onChange={setTopicFilter}
          options={topicOptions}
          value={topicFilter}
        />
      </FilterBar>
      {filteredBlogs.length > 0 ? (
        <BlogList
          blogs={filteredBlogs}
          deleteBlog={deleteBlog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          savePlan={savePlan}
        />
      ) : (
        <EmptyState label="No blogs in this view." />
      )}
    </div>
  );
};
