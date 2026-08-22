import { CalendarFillButton } from "./CalendarFillButton";
import { CalendarQuickFillButton } from "./CalendarQuickFillButton";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarMonthControls } from "./CalendarMonthControls";
import { EmptyState } from "./EmptyState";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { formatCalendarRangeLabel } from "../utils/formatCalendarRangeLabel";
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { CalendarState } from "../types/CalendarState";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { FillCalendarBlankDays } from "../types/FillCalendarBlankDays";
import type { QuickFillCalendar } from "../types/QuickFillCalendar";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarPanelProps = {
  addScheduledTopic: AddScheduledTopic;
  calendarState: CalendarState;
  deleteTopic: DeleteTopic;
  fillCalendarBlankDays: FillCalendarBlankDays;
  quickFillCalendar: QuickFillCalendar;
  knownEligibleTopicCount: number;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  savedTopics: TopicItem[];
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
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
  quickFillCalendar,
  knownEligibleTopicCount,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  savedTopics,
  scheduleTopicOnCalendar,
  topics,
  writeBlog,
}: CalendarPanelProps) => {
  const rangeLabel = formatCalendarRangeLabel(calendarState.dateKeys);
  const occupiedCalendarDates = topics
    .map((topic) => topic.scheduledDate)
    .filter((date): date is string => Boolean(date));
  const occupiedCalendarDateSet = new Set(occupiedCalendarDates);
  const filledCount = occupiedCalendarDateSet.size;
  const openQueueCount = calendarState.openQueueDateKeys.length;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <WorkspacePageHeader
          description={`Schedule saved topics or create new topics with AI on the open dates in your queue. Each fill schedules up to 30 dates in ${calendarState.monthLabel}.`}
          title="Calendar"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <CalendarMonthControls
            isCurrentMonth={calendarState.isCurrentMonth}
            monthLabel={calendarState.monthLabel}
            onCurrentMonth={calendarState.goToCurrentMonth}
            onNextMonth={calendarState.goToNextMonth}
            onPreviousMonth={calendarState.goToPreviousMonth}
          />
          <CalendarQuickFillButton disabled={calendarState.isLoading || calendarState.isFilling || calendarState.isQuickFilling || openQueueCount === 0 || knownEligibleTopicCount === 0} isFilling={calendarState.isQuickFilling} quickFillCalendar={quickFillCalendar} />
          <CalendarFillButton
            disabled={
              calendarState.isFilling ||
              calendarState.isQuickFilling ||
              calendarState.isLoading ||
              openQueueCount === 0
            }
            fillCalendarBlankDays={fillCalendarBlankDays}
            isFilling={calendarState.isFilling}
          />
        </div>
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
            {openQueueCount}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-black/40">
            Range
          </p>
          <p className="mt-1 text-base font-semibold leading-7 text-black">
            {rangeLabel}
          </p>
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
          occupiedCalendarDates={occupiedCalendarDates}
          openBlogPreview={openBlogPreview}
          refreshTopicBrief={refreshTopicBrief}
          removeTopicFromCalendar={removeTopicFromCalendar}
          saveTopicBrief={saveTopicBrief}
          savedTopics={savedTopics}
          scheduleTopicOnCalendar={scheduleTopicOnCalendar}
          topics={topics}
          writeBlog={writeBlog}
        />
      )}
    </section>
  );
};
