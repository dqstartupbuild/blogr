import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { CalendarQueueSettingsDraft } from "../types/CalendarQueueSettingsDraft";
import { getLocalDateKey } from "./getLocalDateKey";

const parseInteger = (value: string, minimum: number, maximum: number) => {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
};

export const buildCalendarQueueSettingsFromDraft = (
  draft: CalendarQueueSettingsDraft,
  currentSettings: CalendarQueueSettings,
  currentDate = new Date(),
): CalendarQueueSettings | null => {
  if (draft.cadence === "daily") return { cadence: "daily" };

  if (draft.cadence === "weekly") {
    const weekday = parseInteger(draft.weeklyWeekday, 0, 6);
    return weekday === null ? null : { cadence: "weekly", weekday };
  }

  if (draft.cadence === "monthly") {
    const dayOfMonth = parseInteger(draft.monthlyDayOfMonth, 1, 31);
    return dayOfMonth === null ? null : { cadence: "monthly", dayOfMonth };
  }

  const intervalDays = parseInteger(draft.customIntervalDays, 1, 90);
  if (intervalDays === null) return null;

  return {
    anchorDate:
      currentSettings.cadence === "custom" &&
      currentSettings.intervalDays === intervalDays
        ? currentSettings.anchorDate
        : getLocalDateKey(currentDate),
    cadence: "custom",
    intervalDays,
  };
};
