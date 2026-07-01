import { fetchMutation } from "convex/nextjs";
import { replaceImageUrlInMdx } from "../blog/replaceImageUrlInMdx";
import { completeAiJobMutation } from "../convex/references/completeAiJobMutation";
import { completeBlogGenerateAiJobMutation } from "../convex/references/completeBlogGenerateAiJobMutation";
import { completeImageRegenerationAiJobMutation } from "../convex/references/completeImageRegenerationAiJobMutation";
import { completeProductScanAiJobMutation } from "../convex/references/completeProductScanAiJobMutation";
import { completeTopicBatchPlanAiJobMutation } from "../convex/references/completeTopicBatchPlanAiJobMutation";
import { completeTopicBriefAiJobMutation } from "../convex/references/completeTopicBriefAiJobMutation";
import type { Id } from "../../../convex/_generated/dataModel";
import type { BlogImage } from "../blog/types/BlogImage";
import type { GeneratedBlog } from "../blog/types/GeneratedBlog";
import type { ProductScanResult } from "../product/types/ProductScanResult";
import type { ScheduledTopicCandidate } from "../topics/types/ScheduledTopicCandidate";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type DurableAiJob = {
  _id: Id<"aiJobs">;
  blogId?: Id<"blogs">;
  input: unknown;
  productId?: Id<"products">;
  topicId?: Id<"topics">;
};

type CompleteDurableBlogAiJobOptions = {
  job: DurableAiJob;
  result: unknown;
  secret: string;
  workerJob: BlogAiWorkerJob;
};

export const completeDurableBlogAiJob = async ({
  job,
  result,
  secret,
  workerJob,
}: CompleteDurableBlogAiJobOptions) => {
  if (workerJob.type === "blog.generate") {
    if (!job.productId) {
      throw new Error("Blog generation job is missing a workspace.");
    }

    const blog = (result as { blog: GeneratedBlog }).blog;

    await fetchMutation(completeBlogGenerateAiJobMutation, {
      ...blog,
      jobId: job._id,
      productId: job.productId,
      secret,
      topicId: job.topicId,
    });
    return;
  }

  if (workerJob.type === "topic.brief") {
    if (!job.topicId) {
      throw new Error("Topic brief job is missing a topic.");
    }

    const notes = (result as { notes: string }).notes;

    if (!notes.trim()) {
      throw new Error("No search brief was found for this topic.");
    }

    await fetchMutation(completeTopicBriefAiJobMutation, {
      jobId: job._id,
      notes,
      productId: job.productId,
      secret,
      topicId: job.topicId,
    });
    return;
  }

  if (workerJob.type === "topic.batchPlan") {
    if (!job.productId) {
      throw new Error("Calendar planning job is missing a workspace.");
    }

    await fetchMutation(completeTopicBatchPlanAiJobMutation, {
      jobId: job._id,
      productId: job.productId,
      secret,
      topics: (result as { topics: ScheduledTopicCandidate[] }).topics,
    });
    return;
  }

  if (workerJob.type === "product.scan") {
    if (!job.productId) {
      throw new Error("Product scan job is missing a workspace.");
    }

    await fetchMutation(completeProductScanAiJobMutation, {
      ...(result as { product: ProductScanResult }).product,
      jobId: job._id,
      productId: job.productId,
      secret,
    });
    return;
  }

  if (workerJob.type === "blog.regenerateImage") {
    if (!job.blogId) {
      throw new Error("Image regeneration job is missing a blog.");
    }

    const image = (result as { image: BlogImage | null }).image;

    if (!image) {
      throw new Error("Could not refresh that image yet.");
    }

    const nextMdx = replaceImageUrlInMdx({
      mdx: workerJob.input.mdx,
      nextUrl: image.url,
      previousUrl: workerJob.input.previousUrl,
    });
    const isFeatureImage =
      workerJob.input.isFeatureImage || workerJob.input.imageIndex === 0;

    await fetchMutation(completeImageRegenerationAiJobMutation, {
      featureImageUrl: isFeatureImage
        ? image.url
        : workerJob.input.currentFeatureImageUrl,
      image,
      imageIndex: workerJob.input.imageIndex,
      jobId: job._id,
      mdx: nextMdx,
      productId: job.productId,
      secret,
    });
    return;
  }

  await fetchMutation(completeAiJobMutation, {
    jobId: job._id,
    result,
    secret,
  });
};
