import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { CalendarQueueSettingsDraft } from "../types/CalendarQueueSettingsDraft";

export const buildCalendarQueueSettingsDraft = (
  settings: CalendarQueueSettings,
): CalendarQueueSettingsDraft => ({
  cadence: settings.cadence,
  customIntervalDays:
    settings.cadence === "custom" ? String(settings.intervalDays) : "7",
  monthlyDayOfMonth:
    settings.cadence === "monthly" ? String(settings.dayOfMonth) : "1",
  weeklyWeekday:
    settings.cadence === "weekly" ? String(settings.weekday) : "1",
});
