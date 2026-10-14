import { getCalendarMonthStartDate } from "./getCalendarMonthStartDate";
import { getLocalDateKey } from "./getLocalDateKey";

export const getCalendarMonthDateKeys = (date: Date) => {
  const monthStartDate = getCalendarMonthStartDate(date);
  const month = monthStartDate.getMonth();
  const dateKeys: string[] = [];
  const cursor = new Date(monthStartDate);

  while (cursor.getMonth() === month) {
    dateKeys.push(getLocalDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dateKeys;
};
