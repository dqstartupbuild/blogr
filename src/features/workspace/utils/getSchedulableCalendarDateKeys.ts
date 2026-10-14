import { getLocalDateKey } from "./getLocalDateKey";

export const getSchedulableCalendarDateKeys = (
  dateKeys: string[],
  today = new Date(),
) => {
  const todayKey = getLocalDateKey(today);

  return dateKeys.filter((dateKey) => dateKey >= todayKey);
};
