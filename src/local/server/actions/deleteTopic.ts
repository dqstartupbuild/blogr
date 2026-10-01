import type { LocalState } from "../../domain/LocalState";
import { getEditableTopic } from "./getEditableTopic";
export const deleteTopic = (state: LocalState, args: Record<string, unknown>) => {
  const topic = getEditableTopic(state, args);
  const linkedBlog = state.blogs.find((item) => item.topicId === topic.id);
  if (linkedBlog) linkedBlog.topicId = undefined;
  state.topics = state.topics.filter((item) => item.id !== topic.id);
  return topic.id;
};
