import { defaultCalendarQueueSettings } from "../constants/defaultCalendarQueueSettings";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import { isValidLocalDateKey } from "./isValidLocalDateKey";

export const normalizeCalendarQueueSettings = (
  value: unknown,
): CalendarQueueSettings => {
  if (!value || typeof value !== "object") return defaultCalendarQueueSettings;
  const settings = value as Record<string, unknown>;
  if (settings.cadence === "daily") return { cadence: "daily" };
  if (settings.cadence === "weekly" && Number.isInteger(settings.weekday) && Number(settings.weekday) >= 0 && Number(settings.weekday) <= 6) return { cadence: "weekly", weekday: Number(settings.weekday) };
  if (settings.cadence === "monthly" && Number.isInteger(settings.dayOfMonth) && Number(settings.dayOfMonth) >= 1 && Number(settings.dayOfMonth) <= 31) return { cadence: "monthly", dayOfMonth: Number(settings.dayOfMonth) };
  if (settings.cadence === "custom" && Number.isInteger(settings.intervalDays) && Number(settings.intervalDays) >= 1 && Number(settings.intervalDays) <= 90 && isValidLocalDateKey(settings.anchorDate)) return { cadence: "custom", intervalDays: Number(settings.intervalDays), anchorDate: settings.anchorDate };
  return defaultCalendarQueueSettings;
};
