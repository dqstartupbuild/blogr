import type { LocalState } from "../../domain/LocalState";
import type { TopicItem } from "@/features/workspace/types/TopicItem";
import { getEditableTopic } from "./getEditableTopic";
export const updateTopicStatus = (state: LocalState, args: Record<string, unknown>) => {
  const topic = getEditableTopic(state, args);
  topic.status = args.status as TopicItem["status"];
  if (args.lastError !== undefined) (topic as TopicItem & { lastError?: string }).lastError = String(args.lastError);
  topic.updatedAt = Math.max(Date.now(), (topic.updatedAt || 0) + 1);
  return topic.id;
};
