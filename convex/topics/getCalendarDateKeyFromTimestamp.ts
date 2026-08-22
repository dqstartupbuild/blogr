export const getCalendarDateKeyFromTimestamp = (
  timestamp: number,
  timeZone?: string,
) => {
  const date = new Date(timestamp);

  try {
    const parts = new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "2-digit",
      timeZone,
      year: "numeric",
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    return date.toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};
