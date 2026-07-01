import { planTopicBatch } from "../topics/planTopicBatch";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type TopicBatchPlanWorkerJob = Extract<
  BlogAiWorkerJob,
  { type: "topic.batchPlan" }
>;

export const runTopicBatchPlanWorkerJob = async ({
  input,
}: TopicBatchPlanWorkerJob) => {
  const topics = await planTopicBatch({
    blankDates: input.blankDates,
    existingBlogs: input.existingBlogs,
    existingTopics: input.existingTopics,
    product: input.product,
  });

  return { topics };
};
