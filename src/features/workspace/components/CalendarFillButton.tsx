import { CalendarPlus } from "lucide-react";
import type { FillCalendarBlankDays } from "../types/FillCalendarBlankDays";

type CalendarFillButtonProps = {
  disabled: boolean;
  fillCalendarBlankDays: FillCalendarBlankDays;
  isFilling: boolean;
};

export const CalendarFillButton = ({
  disabled,
  fillCalendarBlankDays,
  isFilling,
}: CalendarFillButtonProps) => {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black bg-black px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-black/15 disabled:bg-black/10 disabled:text-black/40"
      disabled={disabled}
      onClick={() => {
        void Promise.resolve(fillCalendarBlankDays()).catch(() => undefined);
      }}
      type="button"
    >
      <CalendarPlus size={16} aria-hidden="true" />
      {isFilling ? "Finding topics..." : "AI fill"}
    </button>
  );
};
