import { fetchMutation } from "convex/nextjs";
import { createAiJobMutation } from "../convex/references/createAiJobMutation";
import { dispatchBlogAiWorkerJob } from "../googleCloudRun/dispatchBlogAiWorkerJob";
import type { Id } from "../../../convex/_generated/dataModel";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type CreateBlogAiJobOptions = {
  blogId?: Id<"blogs">;
  input: BlogAiWorkerJob;
  productId?: Id<"products">;
  token?: string;
  topicId?: Id<"topics">;
};

export const createBlogAiJob = async ({
  blogId,
  input,
  productId,
  token,
  topicId,
}: CreateBlogAiJobOptions) => {
  const jobId = await fetchMutation(
    createAiJobMutation,
    {
      blogId,
      input,
      productId,
      topicId,
      type: input.type,
    },
    { token },
  );

  await dispatchBlogAiWorkerJob();

  return jobId;
};
