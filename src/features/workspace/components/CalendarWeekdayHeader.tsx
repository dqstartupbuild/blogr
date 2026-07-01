import { calendarWeekdayLabels } from "../constants/calendarWeekdayLabels";

export const CalendarWeekdayHeader = () => {
  return (
    <div className="grid grid-cols-7 border-b border-black/10 bg-black/[0.03]">
      {calendarWeekdayLabels.map((label) => (
        <div
          className="border-r border-black/10 px-1 py-2 text-center text-[10px] font-semibold uppercase text-black/50 last:border-r-0 sm:px-3 sm:text-xs"
          key={label}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
