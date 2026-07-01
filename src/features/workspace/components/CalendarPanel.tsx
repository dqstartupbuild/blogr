import { CalendarFillButton } from "./CalendarFillButton";
import { CalendarGrid } from "./CalendarGrid";
import { EmptyState } from "./EmptyState";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { formatCalendarRangeLabel } from "../utils/formatCalendarRangeLabel";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { CalendarState } from "../types/CalendarState";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { FillCalendarBlankDays } from "../types/FillCalendarBlankDays";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarPanelProps = {
  addScheduledTopic: AddScheduledTopic;
  calendarState: CalendarState;
  deleteTopic: DeleteTopic;
  fillCalendarBlankDays: FillCalendarBlankDays;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  topics: TopicItem[];
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarPanel = ({
  addScheduledTopic,
  calendarState,
  deleteTopic,
  fillCalendarBlankDays,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topics,
  writeBlog,
}: CalendarPanelProps) => {
  const filledCount = topics.length;
  const blankCount = calendarState.dateKeys.length - filledCount;
  const rangeLabel = formatCalendarRangeLabel(calendarState.dateKeys);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <WorkspacePageHeader
          description={`Plan one keyword per day from ${rangeLabel}.`}
          title="Calendar"
        />
        <CalendarFillButton
          disabled={
            calendarState.isFilling ||
            calendarState.isLoading ||
            blankCount === 0
          }
          fillCalendarBlankDays={fillCalendarBlankDays}
          isFilling={calendarState.isFilling}
        />
      </div>
      <div className="grid gap-3 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-black/40">
            Filled
          </p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {filledCount}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-black/40">Open</p>
          <p className="mt-1 text-2xl font-semibold text-black">
            {blankCount}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-black/40">
            Window
          </p>
          <p className="mt-1 text-2xl font-semibold text-black">30 days</p>
        </div>
      </div>
      {calendarState.message ? (
        <p className="rounded-lg border border-black/10 bg-white p-3 text-sm text-black">
          {calendarState.message}
        </p>
      ) : null}
      {calendarState.isLoading ? (
        <EmptyState label="Loading calendar." />
      ) : (
        <CalendarGrid
          addScheduledTopic={addScheduledTopic}
          dateKeys={calendarState.dateKeys}
          deleteTopic={deleteTopic}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          topics={topics}
          writeBlog={writeBlog}
        />
      )}
    </section>
  );
};
