import type { LocalState } from "../../domain/LocalState";
import { getEditableTopic } from "./getEditableTopic";
export const updateTopicNotes = (state: LocalState, args: Record<string, unknown>) => {
  const topic = getEditableTopic(state, args);
  topic.notes = String(args.notes || "") || undefined;
  topic.updatedAt = Math.max(Date.now(), (topic.updatedAt || 0) + 1);
  return topic.id;
};
