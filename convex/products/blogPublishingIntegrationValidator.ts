import { v } from "convex/values";

export const blogPublishingIntegrationValidator = v.object({
  accessToken: v.string(),
  enabled: v.boolean(),
  sourceName: v.string(),
  updatedAt: v.number(),
  webhookUrl: v.string(),
});
