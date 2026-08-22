import { fetchMutation } from "convex/nextjs";
import { claimNextAiJobMutation } from "../convex/references/claimNextAiJobMutation";
import { failAiJobMutation } from "../convex/references/failAiJobMutation";
import { blogAiWorkerJobSchema } from "./blogAiWorkerJobSchema";
import { completeDurableBlogAiJob } from "./completeDurableBlogAiJob";
import { getBlogAiWorkerErrorMessage } from "./getBlogAiWorkerErrorMessage";
import { getBlogAiWorkerLeaseMs } from "./getBlogAiWorkerLeaseMs";
import { runBlogAiWorkerJob } from "./runBlogAiWorkerJob";

type ClaimAndRunBlogAiJobOptions = {
  secret: string;
};

export const claimAndRunBlogAiJob = async ({
  secret,
}: ClaimAndRunBlogAiJobOptions) => {
  const job = await fetchMutation(claimNextAiJobMutation, {
    leaseMs: getBlogAiWorkerLeaseMs(),
    secret,
  });

  if (!job) {
    return { claimed: false };
  }

  try {
    const workerJob = blogAiWorkerJobSchema.parse(job.input);
    const result = await runBlogAiWorkerJob(workerJob);

    await completeDurableBlogAiJob({
      job,
      result,
      secret,
      workerJob,
    });

    return { claimed: true, jobId: job._id, status: "succeeded" as const };
  } catch (error) {
    const message = getBlogAiWorkerErrorMessage(error);

    await fetchMutation(failAiJobMutation, {
      error: message,
      jobId: job._id,
      secret,
    });

    return { claimed: true, error: message, jobId: job._id, status: "failed" as const };
  }
};
