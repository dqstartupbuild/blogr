import { randomUUID } from "node:crypto";
import type { LocalState } from "../../domain/LocalState";
import type { TopicItem } from "@/features/workspace/types/TopicItem";
import { buildTopicIntentKey } from "@/server/topics/buildTopicIntentKey";
import { isValidCalendarDate } from "../../domain/isValidCalendarDate";
import { getTopicWorkspace } from "./getTopicWorkspace";

export const createTopic = (state: LocalState, args: Record<string, unknown>, scheduled: boolean) => {
  const productId = getTopicWorkspace(state, args);
  const keyword = String(args.keyword || "").trim();
  if (!keyword) throw new Error("Enter a topic.");
  const scheduledDate = scheduled ? String(args.scheduledDate || "") : undefined;
  const existing = state.topics.find((item) => item.productId === productId && item.keyword.toLowerCase() === keyword.toLowerCase());
  if (scheduledDate && (!isValidCalendarDate(scheduledDate) || state.topics.some((item) => item.productId === productId && item.id !== existing?.id && item.scheduledDate === scheduledDate))) throw new Error("Choose an open calendar date.");
  if (existing) {
    if (!scheduledDate || existing.scheduledDate === scheduledDate) return existing.id;
    if (existing.status !== "saved" && existing.status !== "failed") throw new Error("This topic is already scheduled or written. Choose another topic.");
    existing.scheduledDate = scheduledDate;
    if (existing.status === "saved") existing.status = "scheduled";
    existing.updatedAt = Math.max(Date.now(), (existing.updatedAt || 0) + 1);
    return existing.id;
  }
  const now = Date.now();
  const item: TopicItem & { productId: string } = { id: randomUUID(), productId, keyword, canonicalKeyword: keyword, intentKey: buildTopicIntentKey(keyword), notes: String(args.notes || "") || undefined, scheduledDate, sourceType: args.sourceType as TopicItem["sourceType"] || "manual", status: scheduledDate ? "scheduled" : "saved", createdAt: now, updatedAt: now };
  state.topics.push(item);
  return item.id;
};
