import type { LocalState } from "../../domain/LocalState";
import { isValidCalendarDate } from "../../domain/isValidCalendarDate";
import { getTopicWorkspace } from "./getTopicWorkspace";
export const quickFillExistingTopics = (state: LocalState, args: Record<string, unknown>) => {
  const productId = getTopicWorkspace(state, args);
  const given = args.scheduledDates as string[] || [];
  if (given.length > 30) throw new Error("Choose up to 30 calendar dates.");
  if (given.some((date) => !isValidCalendarDate(date))) throw new Error("Choose valid calendar dates.");
  const dates = [...new Set(given)].sort();
  const occupied = new Set(state.topics.filter((item) => item.productId === productId).map((item) => item.scheduledDate));
  const open = dates.filter((date) => !occupied.has(date));
  const eligible = state.topics.filter((item) => item.productId === productId && !item.scheduledDate && (item.status === "saved" || item.status === "failed")).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0) || a.id.localeCompare(b.id));
  const scheduledCount = Math.min(open.length, eligible.length, 30);
  for (let index = 0; index < scheduledCount; index++) { eligible[index].scheduledDate = open[index]; if (eligible[index].status === "saved") eligible[index].status = "scheduled"; eligible[index].updatedAt = Math.max(Date.now(), (eligible[index].updatedAt || 0) + 1); }
  return { scheduledCount, skippedOccupiedDateCount: dates.length - open.length, unusedDateCount: open.length - scheduledCount };
};
