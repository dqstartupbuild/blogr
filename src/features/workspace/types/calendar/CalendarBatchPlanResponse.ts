import type { CalendarBatchTopic } from "./CalendarBatchTopic";

export type CalendarBatchPlanResponse = {
  createdCount?: number;
  error?: string;
  jobId?: string;
  skippedCount?: number;
  status?: "queued" | "running" | "succeeded" | "failed";
  topics?: CalendarBatchTopic[];
};
