import { formatCalendarDateBadge } from "./formatCalendarDateBadge";

export const formatCalendarRangeLabel = (dateKeys: string[]) => {
  const firstDate = dateKeys[0];
  const lastDate = dateKeys[dateKeys.length - 1];

  if (!firstDate || !lastDate) {
    return "";
  }

  return `${formatCalendarDateBadge(firstDate)} - ${formatCalendarDateBadge(
    lastDate,
  )}`;
};
