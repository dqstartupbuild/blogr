import type { CalendarBatchTopic } from "./CalendarBatchTopic";

export type CalendarBatchPlanResponse = {
  error?: string;
  topics?: CalendarBatchTopic[];
};
