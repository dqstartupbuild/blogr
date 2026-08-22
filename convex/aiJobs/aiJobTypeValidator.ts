import { v } from "convex/values";

export const aiJobTypeValidator = v.union(
  v.literal("blog.generate"),
  v.literal("topic.discover"),
  v.literal("topic.brief"),
  v.literal("topic.batchPlan"),
  v.literal("blog.regenerateImage"),
  v.literal("product.scan"),
);
