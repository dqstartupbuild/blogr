import type { LocalState } from "../domain/LocalState";
import { createTopic } from "./actions/createTopic";
import { createScheduledTopicBatch } from "./actions/createScheduledTopicBatch";
import { createTopicBatch } from "./actions/createTopicBatch";
import { quickFillExistingTopics } from "./actions/quickFillExistingTopics";
import { deleteTopic } from "./actions/deleteTopic";
import { updateTopicNotes } from "./actions/updateTopicNotes";
import { updateTopicScheduledDate } from "./actions/updateTopicScheduledDate";
import { updateTopicStatus } from "./actions/updateTopicStatus";

const handlers = {
  createScheduledTopicBatchMutation: createScheduledTopicBatch,
  createTopicBatchMutation: createTopicBatch,
  quickFillExistingTopicsMutation: quickFillExistingTopics,
  deleteTopicMutation: deleteTopic,
  updateTopicNotesMutation: updateTopicNotes,
  updateTopicScheduledDateMutation: updateTopicScheduledDate,
  updateTopicStatusMutation: updateTopicStatus,
};

export const mutateTopic = (state: LocalState, name: string, args: Record<string, unknown>): unknown => {
  if (name === "createTopicMutation") return createTopic(state, args, false);
  if (name === "createScheduledTopicMutation") return createTopic(state, args, true);
  const handler = handlers[name as keyof typeof handlers];
  if (!handler) throw new Error(`Unknown topic change: ${name}`);
  return handler(state, args);
};
