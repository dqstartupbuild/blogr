import type { CalendarBatchTopic } from "./calendar/CalendarBatchTopic";

export type TopicIdeasResponse = {
  error?: string;
  topics?: Omit<CalendarBatchTopic, "scheduledDate">[];
};
