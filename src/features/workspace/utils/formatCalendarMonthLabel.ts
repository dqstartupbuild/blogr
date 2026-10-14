export const formatCalendarMonthLabel = (date: Date) => {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
};
