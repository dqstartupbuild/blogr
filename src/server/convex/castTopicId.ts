import type { Id } from "../../../convex/_generated/dataModel";

export const castTopicId = (topicId: string) => {
  return topicId as Id<"topics">;
};
