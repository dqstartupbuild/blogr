import { v } from "convex/values";

export const topicSourceTypeValidator = v.union(
  v.literal("manual"),
  v.literal("discovery"),
  v.literal("gap"),
  v.literal("comparison"),
  v.literal("question"),
  v.literal("cluster"),
  v.literal("refresh"),
  v.literal("aeo"),
  v.literal("difficulty"),
);
