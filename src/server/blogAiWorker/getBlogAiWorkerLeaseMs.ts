const defaultBlogAiWorkerLeaseMs = 30 * 60 * 1000;

export const getBlogAiWorkerLeaseMs = () => {
  const value = Number.parseInt(process.env.BLOG_AI_WORKER_LEASE_MS || "", 10);

  return Number.isFinite(value) && value > 0
    ? value
    : defaultBlogAiWorkerLeaseMs;
};
