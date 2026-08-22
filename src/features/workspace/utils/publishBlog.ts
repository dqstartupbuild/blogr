import type { BlogItem } from "../types/BlogItem";
import type { BlogPublishResponse } from "../types/publishing/BlogPublishResponse";

export const publishBlog = async (blog: BlogItem) => {
  const response = await fetch("/api/blogs/publish", {
    body: JSON.stringify({ blog }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const data = (await response
    .json()
    .catch(() => ({}))) as BlogPublishResponse;

  if (!response.ok || !data.published) {
    throw new Error(data.error || "Could not publish yet.");
  }

  return data.message || "Published.";
};
