import { fetchQuery } from "convex/nextjs";
import { getAiJobQuery } from "../convex/references/getAiJobQuery";
import { getBlogAiJobPollDelayMs } from "./getBlogAiJobPollDelayMs";
import { getBlogAiJobRouteWaitMs } from "./getBlogAiJobRouteWaitMs";
import type { Id } from "../../../convex/_generated/dataModel";

type WaitForBlogAiJobOptions = {
  jobId: Id<"aiJobs">;
  maximumWaitMs?: number;
  token?: string;
};

export const waitForBlogAiJob = async ({
  jobId,
  maximumWaitMs,
  token,
}: WaitForBlogAiJobOptions) => {
  const deadline = Date.now() + getBlogAiJobRouteWaitMs(maximumWaitMs);
  let pollCount = 0;

  while (Date.now() < deadline) {
    const job = await fetchQuery(getAiJobQuery, { jobId }, { token });

    if (!job || job.status === "succeeded" || job.status === "failed") {
      return job;
    }

    const remainingWaitMs = deadline - Date.now();

    if (remainingWaitMs <= 0) {
      break;
    }

    await new Promise((resolve) =>
      setTimeout(
        resolve,
        Math.min(getBlogAiJobPollDelayMs(pollCount), remainingWaitMs),
      ),
    );
    pollCount += 1;
  }

  return await fetchQuery(getAiJobQuery, { jobId }, { token });
};
