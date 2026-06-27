import type { BlogItem } from "./BlogItem";

export type WorkspaceSummary = {
  blogCount: number;
  imageCount: number;
  publishedBlogCount: number;
  recentBlogs: BlogItem[];
  topicCount: number;
};
