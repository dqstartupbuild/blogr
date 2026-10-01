import type { LocalState } from "../../domain/LocalState";
import { getTopicWorkspace } from "./getTopicWorkspace";
export const getEditableTopic = (state: LocalState, args: Record<string, unknown>) => {
  const productId = getTopicWorkspace(state, args);
  const topic = state.topics.find((item) => item.id === args.topicId && item.productId === productId);
  if (!topic) throw new Error("Topic not found in this workspace.");
  return topic;
};
