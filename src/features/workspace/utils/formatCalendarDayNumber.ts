import { parseLocalDateKey } from "./parseLocalDateKey";

export const formatCalendarDayNumber = (dateKey: string) => {
  return String(parseLocalDateKey(dateKey).getDate());
};
