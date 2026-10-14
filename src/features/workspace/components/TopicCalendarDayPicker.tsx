import { Check } from "lucide-react";
import { calendarWeekdayLabels } from "../constants/calendarWeekdayLabels";
import { buildCalendarDateSlots } from "../utils/buildCalendarDateSlots";
import { formatCalendarDateLabel } from "../utils/formatCalendarDateLabel";
import { formatCalendarDayNumber } from "../utils/formatCalendarDayNumber";
import { formatCalendarMonthLabel } from "../utils/formatCalendarMonthLabel";
import { getLocalDateKey } from "../utils/getLocalDateKey";
import { parseLocalDateKey } from "../utils/parseLocalDateKey";

type TopicCalendarDayPickerProps = {
  calendarDateKeys: string[];
  currentDate?: string;
  onSelect: (dateKey: string) => void;
  openDateKeys: string[];
  selectedDate: string;
  takenDateKeys: string[];
};

const getDayClassName = ({
  isCurrent,
  isOpen,
  isSelected,
  isToday,
}: {
  isCurrent: boolean;
  isOpen: boolean;
  isSelected: boolean;
  isToday: boolean;
}) => {
  const base =
    "relative grid h-8 min-w-0 place-items-center rounded-md text-xs transition";

  if (isSelected) {
    return `${base} bg-black font-semibold text-white`;
  }

  if (isCurrent) {
    return `${base} border border-black font-semibold text-black hover:bg-black/5`;
  }

  if (isOpen) {
    return `${base} ${isToday ? "font-semibold underline" : ""} text-black hover:bg-black/10`;
  }

  return `${base} cursor-not-allowed text-black/25`;
};

export const TopicCalendarDayPicker = ({
  calendarDateKeys,
  currentDate,
  onSelect,
  openDateKeys,
  selectedDate,
  takenDateKeys,
}: TopicCalendarDayPickerProps) => {
  const dateSlots = buildCalendarDateSlots(calendarDateKeys);
  const openDateSet = new Set(openDateKeys);
  const takenDateSet = new Set(takenDateKeys);
  const todayDateKey = getLocalDateKey(new Date());

  if (calendarDateKeys.length === 0) {
    return null;
  }

  return (
    <div className="grid w-full min-w-0 max-w-[17rem] gap-2">
      <p className="text-sm font-semibold text-black">
        {formatCalendarMonthLabel(parseLocalDateKey(calendarDateKeys[0]))}
      </p>
      <div className="grid grid-cols-7 gap-0.5">
        {calendarWeekdayLabels.map((label) => (
          <span
            className="text-center text-[10px] font-semibold text-black/50"
            key={label}
          >
            {label}
          </span>
        ))}
        {dateSlots.map((dateKey, index) => {
          if (!dateKey) {
            return <span aria-hidden="true" key={`spacer-${index}`} />;
          }

          const isCurrent = dateKey === currentDate;
          const isOpen = openDateSet.has(dateKey);
          const isSelected = dateKey === selectedDate;
          const isTaken = takenDateSet.has(dateKey);

          return (
            <button
              aria-label={formatCalendarDateLabel(dateKey)}
              aria-pressed={isSelected}
              className={getDayClassName({
                isCurrent,
                isOpen,
                isSelected,
                isToday: dateKey === todayDateKey,
              })}
              disabled={!isOpen}
              key={dateKey}
              onClick={() => onSelect(dateKey)}
              title={
                isTaken
                  ? "Something is already scheduled"
                  : isOpen
                    ? undefined
                    : "This day is not open"
              }
              type="button"
            >
              {formatCalendarDayNumber(dateKey)}
              {isTaken ? (
                <Check
                  aria-hidden="true"
                  className="absolute right-0.5 top-0.5 text-black"
                  size={11}
                  strokeWidth={3}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
