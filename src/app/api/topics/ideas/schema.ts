import { topicBatchPlanRequestSchema } from "../batch-plan/schema";

export const topicIdeasRequestSchema = topicBatchPlanRequestSchema.omit({
  blankDates: true,
});
