import { randomUUID } from "node:crypto";
import type { LocalState } from "../../domain/LocalState";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { pickGeneratedBlogFields } from "../pickGeneratedBlogFields";
import { archiveBlogVersion } from "../archiveBlogVersion";
import { nextBlogUpdatedAt } from "./nextBlogUpdatedAt";

export const upsertGeneratedBlog = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  if (!state.products.some((item) => item.id === productId)) throw new Error("Workspace not found.");
  const topicId = String(args.topicId || "");
  const topic = state.topics.find((item) => item.id === topicId && item.productId === productId);
  if (topicId && !topic) throw new Error("Topic not found in this workspace.");
  const existing = topic ? state.blogs.find((item) => item.topicId === topic.id || item.id === topic.blogId) : undefined;
  const details = pickGeneratedBlogFields(args);
  const status = String(args.status || "draft") as BlogItem["status"];
  const now = nextBlogUpdatedAt(state);
  if (existing) {
    archiveBlogVersion(state, existing);
    Object.assign(existing, details, { updatedAt: now, publishedAt: status === "published" ? existing.publishedAt || now : existing.publishedAt });
    if (topic) { topic.blogId = existing.id; topic.status = status === "failed" ? "failed" : status === "published" ? "published" : "written"; topic.updatedAt = Math.max(now, (topic.updatedAt || 0) + 1); }
    return existing.id;
  }
  const item = { ...details, id: randomUUID(), productId, topicId: topicId || undefined, createdAt: now, updatedAt: now, publishedAt: status === "published" ? now : undefined } as BlogItem & { topicId?: string };
  state.blogs.push(item);
  if (topic) { topic.blogId = item.id; topic.status = status === "failed" ? "failed" : status === "published" ? "published" : "written"; topic.updatedAt = Math.max(now, (topic.updatedAt || 0) + 1); }
  return item.id;
};
