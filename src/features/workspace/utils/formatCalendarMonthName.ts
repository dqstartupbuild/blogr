import { parseLocalDateKey } from "./parseLocalDateKey";

export const formatCalendarMonthName = (dateKey: string) => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
  }).format(parseLocalDateKey(dateKey));
};
