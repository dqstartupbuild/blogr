"use client";

import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { TopicList } from "./TopicList";
import { TopicStatusFilterTabs } from "./TopicStatusFilterTabs";
import { filterTopicsByStatus } from "../utils/filterTopicsByStatus";
import type { TopicItem } from "../types/TopicItem";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type FilteredTopicListProps = {
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const FilteredTopicList = ({
  topics,
  writeBlog,
}: FilteredTopicListProps) => {
  const [activeFilter, setActiveFilter] = useState<TopicStatusFilter>("all");
  const filteredTopics = filterTopicsByStatus(topics, activeFilter);

  if (topics.length === 0) {
    return <EmptyState label="No topics yet." />;
  }

  return (
    <>
      <TopicStatusFilterTabs
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />
      {filteredTopics.length > 0 ? (
        <TopicList topics={filteredTopics} writeBlog={writeBlog} />
      ) : (
        <EmptyState label="No topics in this view." />
      )}
    </>
  );
};
