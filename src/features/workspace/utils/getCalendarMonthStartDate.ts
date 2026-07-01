export const getCalendarMonthStartDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
