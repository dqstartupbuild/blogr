import { fetchQuery } from "convex/nextjs";
import { getAiJobQuery } from "../convex/references/getAiJobQuery";
import { getBlogAiJobRouteWaitMs } from "./getBlogAiJobRouteWaitMs";
import type { Id } from "../../../convex/_generated/dataModel";

type WaitForBlogAiJobOptions = {
  jobId: Id<"aiJobs">;
  token?: string;
};

const wait = async (delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};

export const waitForBlogAiJob = async ({
  jobId,
  token,
}: WaitForBlogAiJobOptions) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < getBlogAiJobRouteWaitMs()) {
    const job = await fetchQuery(getAiJobQuery, { jobId }, { token });

    if (!job || job.status === "succeeded" || job.status === "failed") {
      return job;
    }

    await wait(2000);
  }

  return await fetchQuery(getAiJobQuery, { jobId }, { token });
};
