export type CalendarState = {
  calendarQueueSettings: import("./CalendarQueueSettings").CalendarQueueSettings;
  dateKeys: string[];
  fillableDateKeys: string[];
  goToCurrentMonth: () => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  isCurrentMonth: boolean;
  isFilling: boolean;
  isQuickFilling: boolean;
  isSavingQueueSettings: boolean;
  isLoading: boolean;
  message: string;
  monthLabel: string;
  openQueueDateKeys: string[];
  queueDateKeys: string[];
};
