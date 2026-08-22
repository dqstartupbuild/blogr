export const getBlogAiWorkerSecret = () =>
  process.env.BLOG_AI_WORKER_SECRET?.trim() || "";
