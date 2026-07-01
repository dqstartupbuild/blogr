export const getBlogAiWorkerMaxJobs = (value: unknown) => {
  const parsedValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.parseInt(process.env.BLOG_AI_WORKER_MAX_JOBS || "1", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.min(parsedValue, 10)
    : 1;
};
