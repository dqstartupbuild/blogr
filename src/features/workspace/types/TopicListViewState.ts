import type { ListPaginationState } from "./ListPaginationState";
import type { TopicStatusFilter } from "./TopicStatusFilter";

export type TopicListViewState = {
  activeFilter: TopicStatusFilter;
  pagination: ListPaginationState;
  searchQuery: string;
  setActiveFilter: (filter: TopicStatusFilter) => void;
  setSearchQuery: (query: string) => void;
};
