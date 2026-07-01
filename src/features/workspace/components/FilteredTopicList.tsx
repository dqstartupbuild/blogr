"use client";

import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterSelect } from "./FilterSelect";
import { ListPaginationControls } from "./ListPaginationControls";
import { SearchField } from "./SearchField";
import { TopicList } from "./TopicList";
import { topicStatusFilterOptions } from "../constants/topicStatusFilterOptions";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type FilteredTopicListProps = {
  calendarDateKeys: string[];
  deleteTopic: DeleteTopic;
  listState: TopicListViewState;
  occupiedCalendarDates: string[];
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const FilteredTopicList = ({
  calendarDateKeys,
  deleteTopic,
  listState,
  occupiedCalendarDates,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  scheduleTopicOnCalendar,
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
          calendarDateKeys={calendarDateKeys}
          deleteTopic={deleteTopic}
          occupiedCalendarDates={occupiedCalendarDates}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
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
