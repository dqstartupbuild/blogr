import { getLocalDateKey } from "./getLocalDateKey";

export const getNextCalendarDateKeys = (dayCount: number) => {
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return getLocalDateKey(date);
  });
};
