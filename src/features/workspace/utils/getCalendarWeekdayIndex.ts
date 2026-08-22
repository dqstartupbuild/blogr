import { parseLocalDateKey } from "./parseLocalDateKey";

export const getCalendarWeekdayIndex = (dateKey: string) => {
  return parseLocalDateKey(dateKey).getDay();
};
