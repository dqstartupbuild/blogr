import type { LocalState } from "../../domain/LocalState";
import { isValidCalendarDate } from "../../domain/isValidCalendarDate";
import { getEditableTopic } from "./getEditableTopic";
export const updateTopicScheduledDate = (state: LocalState, args: Record<string, unknown>) => {
  const topic = getEditableTopic(state, args);
  const date = args.scheduledDate ? String(args.scheduledDate) : undefined;
  if (date && (!isValidCalendarDate(date) || (topic.status !== "saved" && topic.status !== "failed") || state.topics.some((item) => item.id !== topic.id && item.productId === topic.productId && item.scheduledDate === date))) throw new Error("Choose an open date for a saved or failed topic.");
  topic.scheduledDate = date;
  if (date && topic.status === "saved") topic.status = "scheduled";
  else if (!date && topic.status === "scheduled") topic.status = "saved";
  topic.updatedAt = Math.max(Date.now(), (topic.updatedAt || 0) + 1);
  return topic.id;
};
