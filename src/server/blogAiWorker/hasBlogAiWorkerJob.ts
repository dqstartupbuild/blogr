export const hasBlogAiWorkerJob = () =>
  Boolean(
    process.env.BLOG_AI_WORKER_JOB_PROJECT_ID &&
      process.env.BLOG_AI_WORKER_JOB_LOCATION &&
      process.env.BLOG_AI_WORKER_JOB_NAME,
  );
