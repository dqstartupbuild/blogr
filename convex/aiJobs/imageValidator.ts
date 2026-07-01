import { v } from "convex/values";

export const imageValidator = v.object({
  alt: v.string(),
  prompt: v.string(),
  r2Key: v.optional(v.string()),
  url: v.string(),
});
