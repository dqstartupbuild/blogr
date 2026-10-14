import { parseLocalDateKey } from "./parseLocalDateKey";

export const formatCalendarDateLabel = (dateKey: string) => {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(parseLocalDateKey(dateKey));
};
