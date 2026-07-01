export type CalendarState = {
  dateKeys: string[];
  fillableDateKeys: string[];
  goToCurrentMonth: () => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  isCurrentMonth: boolean;
  isFilling: boolean;
  isLoading: boolean;
  message: string;
  monthLabel: string;
};
