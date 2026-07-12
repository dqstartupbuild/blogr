import type { Id } from "../../../convex/_generated/dataModel";

export const castAiJobId = (jobId: string) => {
  return jobId as Id<"aiJobs">;
};
