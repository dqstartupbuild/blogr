"use client";

import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterSelect } from "./FilterSelect";
import { ListPaginationControls } from "./ListPaginationControls";
import { SearchField } from "./SearchField";
import { TopicList } from "./TopicList";
import { topicStatusFilterOptions } from "../constants/topicStatusFilterOptions";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type FilteredTopicListProps = {
  deleteTopic: DeleteTopic;
  listState: TopicListViewState;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  saveTopicBrief: SaveTopicBrief;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const FilteredTopicList = ({
  deleteTopic,
  listState,
  refreshTopicBrief,
  saveTopicBrief,
  topics,
  writeBlog,
}: FilteredTopicListProps) => {
  return (
    <div className="space-y-4">
      <FilterBar>
        <SearchField
          label="Search topics"
          onChange={listState.setSearchQuery}
          placeholder="Search topics..."
          value={listState.searchQuery}
        />
        <FilterSelect
          label="Status"
          onChange={(value) =>
            listState.setActiveFilter(value as TopicStatusFilter)
          }
          options={topicStatusFilterOptions}
          value={listState.activeFilter}
        />
      </FilterBar>
      {listState.pagination.isLoading ? (
        <EmptyState label="Loading topics." />
      ) : topics.length > 0 ? (
        <TopicList
          deleteTopic={deleteTopic}
          refreshTopicBrief={refreshTopicBrief}
          saveTopicBrief={saveTopicBrief}
          topics={topics}
          writeBlog={writeBlog}
        />
      ) : (
        <EmptyState label="No topics in this view." />
      )}
      <ListPaginationControls pagination={listState.pagination} />
    </div>
  );
};
