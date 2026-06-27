"use client";

import { useEffect } from "react";
import { BlogList } from "./BlogList";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterSelect } from "./FilterSelect";
import { ListPaginationControls } from "./ListPaginationControls";
import { SearchField } from "./SearchField";
import { blogStatusFilterOptions } from "../constants/blogStatusFilterOptions";
import type { BlogItem } from "../types/BlogItem";
import type { BlogListViewState } from "../types/BlogListViewState";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";

type FilteredBlogListProps = {
  blogs: BlogItem[];
  deleteBlog: DeleteBlog;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  listState: BlogListViewState;
  previewBlog: (blogId: string) => void;
  savePlan: SaveDiscoveryPlan;
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const FilteredBlogList = ({
  blogs,
  deleteBlog,
  discoverBlogRefreshIdeas,
  listState,
  previewBlog,
  savePlan,
  selectedBlogId,
  setSelectedBlogId,
}: FilteredBlogListProps) => {
  useEffect(() => {
    if (blogs.length === 0) {
      return;
    }

    if (blogs.some((blog) => blog.id === selectedBlogId)) {
      return;
    }

    setSelectedBlogId(blogs[0].id);
  }, [blogs, selectedBlogId, setSelectedBlogId]);

  return (
    <div className="space-y-4">
      <FilterBar>
        <SearchField
          label="Search articles"
          onChange={listState.setSearchQuery}
          placeholder="Search articles..."
          value={listState.searchQuery}
        />
        <FilterSelect
          label="Status"
          onChange={(value) =>
            listState.setActiveFilter(value as BlogStatusFilter)
          }
          options={blogStatusFilterOptions}
          value={listState.activeFilter}
        />
        <FilterSelect
          label="Topic"
          onChange={listState.setTopicFilter}
          options={listState.topicOptions}
          value={listState.topicFilter}
        />
      </FilterBar>
      {listState.pagination.isLoading ? (
        <EmptyState label="Loading articles." />
      ) : blogs.length > 0 ? (
        <BlogList
          blogs={blogs}
          deleteBlog={deleteBlog}
          discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
          previewBlog={previewBlog}
          savePlan={savePlan}
          selectedBlogId={selectedBlogId}
        />
      ) : (
        <EmptyState label="No blogs in this view." />
      )}
      <ListPaginationControls pagination={listState.pagination} />
    </div>
  );
};
