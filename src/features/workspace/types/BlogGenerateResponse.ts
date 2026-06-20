import type { GeneratedBlog } from "@/server/blog/types/GeneratedBlog";

export type BlogGenerateResponse = {
  blog?: GeneratedBlog;
  error?: string;
};
