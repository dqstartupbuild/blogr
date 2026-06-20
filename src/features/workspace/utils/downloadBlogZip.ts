import type { BlogItem } from "../types/BlogItem";
import { downloadBlob } from "./downloadBlob";
import { safeClientFilename } from "./safeClientFilename";

export const downloadBlogZip = async (blog: BlogItem) => {
  const response = await fetch("/api/blogs/download", {
    body: JSON.stringify({ blog }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Could not download yet.");
  }

  const blob = await response.blob();
  const filename = `${safeClientFilename(blog.slug || blog.title)}.zip`;

  downloadBlob({ blob, filename });
};
