import type { BlogPublishingIntegration } from "../types/integrations/BlogPublishingIntegration";

export const emptyBlogPublishingIntegration: BlogPublishingIntegration = {
  enabled: false,
  hasAccessToken: false,
  sourceName: "Blogger",
  webhookUrl: "",
};
