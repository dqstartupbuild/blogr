import { getCalendarWeekdayIndex } from "./getCalendarWeekdayIndex";

export const buildCalendarDateSlots = (dateKeys: string[]) => {
  if (dateKeys.length === 0) {
    return [];
  }

  const leadingSlots = Array.from<null>({
    length: getCalendarWeekdayIndex(dateKeys[0]),
  }).fill(null);
  const filledSlots = [...leadingSlots, ...dateKeys];
  const trailingSlotCount = (7 - (filledSlots.length % 7)) % 7;
  const trailingSlots = Array.from<null>({ length: trailingSlotCount }).fill(
    null,
  );

  return [...filledSlots, ...trailingSlots];
};
