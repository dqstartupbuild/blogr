import { generateBlogForKeyword } from "../blog/generateBlogForKeyword";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type BlogGenerateWorkerJob = Extract<
  BlogAiWorkerJob,
  { type: "blog.generate" }
>;

export const runBlogGenerateWorkerJob = async ({
  convexAuthToken,
  input,
  userId,
}: BlogGenerateWorkerJob) => {
  const blog = await generateBlogForKeyword({
    ...input,
    convexAuthToken,
    userId,
  });

  return { blog };
};
