import type { BlogStatusFilter } from "./BlogStatusFilter";
import type { FilterOption } from "./FilterOption";
import type { ListPaginationState } from "./ListPaginationState";

export type BlogListViewState = {
  activeFilter: BlogStatusFilter;
  pagination: ListPaginationState;
  searchQuery: string;
  setActiveFilter: (filter: BlogStatusFilter) => void;
  setSearchQuery: (query: string) => void;
  setTopicFilter: (topic: string) => void;
  topicFilter: string;
  topicOptions: FilterOption[];
};
