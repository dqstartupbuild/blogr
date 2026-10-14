export const getBlogPublishTimeoutMs = () => {
  const value = Number(process.env.BLOG_PUBLISH_TIMEOUT_MS);

  if (!Number.isFinite(value) || value <= 0) {
    return 15000;
  }

  return Math.min(value, 60000);
};
