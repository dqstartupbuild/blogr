import { getCalendarMonthStartDate } from "./getCalendarMonthStartDate";

export const shiftCalendarMonthDate = (date: Date, monthDelta: number) => {
  const monthStartDate = getCalendarMonthStartDate(date);
  monthStartDate.setMonth(monthStartDate.getMonth() + monthDelta);

  return monthStartDate;
};
