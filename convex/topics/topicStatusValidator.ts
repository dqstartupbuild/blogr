import { v } from "convex/values";

export const topicStatusValidator = v.union(
  v.literal("saved"),
  v.literal("scheduled"),
  v.literal("writing"),
  v.literal("written"),
  v.literal("failed"),
);
