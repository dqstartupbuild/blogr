const maximumBlogAiJobRouteWaitMs = 240000;

export const getBlogAiJobRouteWaitMs = (maximumWaitMs?: number) => {
  const value = Number.parseInt(process.env.BLOG_AI_JOB_ROUTE_WAIT_MS || "", 10);
  const routeMaximumWaitMs =
    maximumWaitMs !== undefined &&
    Number.isFinite(maximumWaitMs) &&
    maximumWaitMs > 0
      ? maximumWaitMs
      : maximumBlogAiJobRouteWaitMs;
  const safeMaximumWaitMs = Math.min(
    routeMaximumWaitMs,
    maximumBlogAiJobRouteWaitMs,
  );

  if (!Number.isFinite(value) || value <= 0) {
    return safeMaximumWaitMs;
  }

  return Math.min(value, safeMaximumWaitMs);
};
