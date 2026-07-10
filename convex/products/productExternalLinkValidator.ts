import { v } from "convex/values";

export const productExternalLinkValidator = v.object({
  label: v.string(),
  url: v.string(),
});
