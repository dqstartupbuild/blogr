"use client";

import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterSelect } from "./FilterSelect";
import { SearchField } from "./SearchField";
import { TopicList } from "./TopicList";
import { topicStatusFilterOptions } from "../constants/topicStatusFilterOptions";
import { filterTopicsBySearch } from "../utils/filterTopicsBySearch";
import { filterTopicsByStatus } from "../utils/filterTopicsByStatus";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { TopicItem } from "../types/TopicItem";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type FilteredTopicListProps = {
  deleteTopic: DeleteTopic;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const FilteredTopicList = ({
  deleteTopic,
  refreshTopicBrief,
  topics,
  writeBlog,
}: FilteredTopicListProps) => {
  const [activeFilter, setActiveFilter] = useState<TopicStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTopics = filterTopicsBySearch(
    filterTopicsByStatus(topics, activeFilter),
    searchQuery,
  );

  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <div className="space-y-4">
      <FilterBar>
        <SearchField
          label="Search topics"
          onChange={setSearchQuery}
          placeholder="Search topics..."
          value={searchQuery}
        />
        <FilterSelect
          label="Status"
          onChange={(value) => setActiveFilter(value as TopicStatusFilter)}
          options={topicStatusFilterOptions}
          value={activeFilter}
        />
      </FilterBar>
      {filteredTopics.length > 0 ? (
        <TopicList
          deleteTopic={deleteTopic}
          refreshTopicBrief={refreshTopicBrief}
          topics={filteredTopics}
          writeBlog={writeBlog}
        />
      ) : (
        <EmptyState label="No topics in this view." />
      )}
    </div>
  );
};
