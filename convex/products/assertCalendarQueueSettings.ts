import { isValidCalendarDateKey } from "./isValidCalendarDateKey";

export const assertCalendarQueueSettings = (settings: { cadence: string; weekday?: number; dayOfMonth?: number; intervalDays?: number; anchorDate?: string }) => {
  if (settings.cadence === "daily") return;
  if (settings.cadence === "weekly" && Number.isInteger(settings.weekday) && settings.weekday! >= 0 && settings.weekday! <= 6) return;
  if (settings.cadence === "monthly" && Number.isInteger(settings.dayOfMonth) && settings.dayOfMonth! >= 1 && settings.dayOfMonth! <= 31) return;
  if (settings.cadence === "custom" && Number.isInteger(settings.intervalDays) && settings.intervalDays! >= 1 && settings.intervalDays! <= 90 && typeof settings.anchorDate === "string" && isValidCalendarDateKey(settings.anchorDate)) return;
  throw new Error("Choose a valid calendar queue.");
};
