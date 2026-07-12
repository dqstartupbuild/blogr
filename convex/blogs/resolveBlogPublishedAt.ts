type BlogStatus = "draft" | "ready" | "failed" | "published";

export const resolveBlogPublishedAt = (
  status: BlogStatus,
  publishedAt: number | undefined,
  now: number,
) => {
  if (status === "published") {
    return publishedAt || now;
  }

  return publishedAt;
};
