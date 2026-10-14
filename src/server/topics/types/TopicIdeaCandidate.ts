import type { ScheduledTopicCandidate } from "./ScheduledTopicCandidate";

export type TopicIdeaCandidate = Omit<ScheduledTopicCandidate, "scheduledDate">;
