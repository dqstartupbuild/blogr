const defaultBlogAiJobRouteWaitMs = 280000;

export const getBlogAiJobRouteWaitMs = () => {
  const value = Number.parseInt(process.env.BLOG_AI_JOB_ROUTE_WAIT_MS || "", 10);

  return Number.isFinite(value) && value > 0
    ? value
    : defaultBlogAiJobRouteWaitMs;
};
