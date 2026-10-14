import { parseLocalDateKey } from "./parseLocalDateKey";

export const formatCalendarDateBadge = (dateKey: string) => {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(parseLocalDateKey(dateKey));
};
