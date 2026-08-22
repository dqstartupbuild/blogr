import { regenerateBlogImage } from "../blog/regenerateBlogImage";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type BlogImageRegenerateWorkerJob = Extract<
  BlogAiWorkerJob,
  { type: "blog.regenerateImage" }
>;

export const runBlogImageRegenerateWorkerJob = async ({
  convexAuthToken,
  input,
  userId,
}: BlogImageRegenerateWorkerJob) => {
  const image = await regenerateBlogImage({
    alt: input.alt,
    prompt: input.prompt,
    sectionHeading: input.sectionHeading,
    sectionIndex: input.sectionIndex,
    token: convexAuthToken,
    userId,
  });

  return { image };
};
