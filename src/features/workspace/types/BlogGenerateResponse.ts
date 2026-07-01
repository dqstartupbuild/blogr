import type { GeneratedBlog } from "@/server/blog/types/GeneratedBlog";

export type BlogGenerateResponse = {
  blog?: GeneratedBlog;
  blogId?: string;
  error?: string;
  jobId?: string;
  status?: "queued" | "running" | "succeeded" | "failed";
};
