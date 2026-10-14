import { calendarWeekdayLabels } from "../constants/calendarWeekdayLabels";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import { formatOrdinalNumber } from "./formatOrdinalNumber";

export const formatCalendarQueueSummary = (settings: CalendarQueueSettings) => {
  if (settings.cadence === "daily") return "Queue: Daily";
  if (settings.cadence === "weekly") return `Queue: ${calendarWeekdayLabels[settings.weekday]}days`;
  if (settings.cadence === "monthly") return `Queue: Monthly · ${formatOrdinalNumber(settings.dayOfMonth)}`;
  return `Queue: Every ${settings.intervalDays} days`;
};
