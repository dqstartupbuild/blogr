import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type CalendarMonthControlsProps = {
  isCurrentMonth: boolean;
  monthLabel: string;
  onCurrentMonth: () => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
};

export const CalendarMonthControls = ({
  isCurrentMonth,
  monthLabel,
  onCurrentMonth,
  onNextMonth,
  onPreviousMonth,
}: CalendarMonthControlsProps) => {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <button
        aria-label="Previous month"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-white text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
        onClick={onPreviousMonth}
        type="button"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <p className="min-w-0 px-1 text-base font-semibold text-black">
        {monthLabel}
      </p>
      <button
        aria-label="Next month"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-white text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
        onClick={onNextMonth}
        type="button"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isCurrentMonth}
        onClick={onCurrentMonth}
        type="button"
      >
        <RotateCcw size={16} aria-hidden="true" />
        This month
      </button>
    </div>
  );
};
