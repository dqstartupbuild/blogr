import { runBlogGenerateWorkerJob } from "./runBlogGenerateWorkerJob";
import { runBlogImageRegenerateWorkerJob } from "./runBlogImageRegenerateWorkerJob";
import { runProductScanWorkerJob } from "./runProductScanWorkerJob";
import { runTopicBriefWorkerJob } from "./runTopicBriefWorkerJob";
import { runTopicBatchPlanWorkerJob } from "./runTopicBatchPlanWorkerJob";
import { runTopicDiscoverWorkerJob } from "./runTopicDiscoverWorkerJob";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

export const runBlogAiWorkerJob = async (job: BlogAiWorkerJob) => {
  switch (job.type) {
    case "blog.generate":
      return await runBlogGenerateWorkerJob(job);
    case "topic.discover":
      return await runTopicDiscoverWorkerJob(job);
    case "topic.brief":
      return await runTopicBriefWorkerJob(job);
    case "topic.batchPlan":
      return await runTopicBatchPlanWorkerJob(job);
    case "blog.regenerateImage":
      return await runBlogImageRegenerateWorkerJob(job);
    case "product.scan":
      return await runProductScanWorkerJob(job);
  }
};
