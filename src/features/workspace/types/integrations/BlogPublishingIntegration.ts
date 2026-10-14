export type BlogPublishingIntegration = {
  enabled: boolean;
  hasAccessToken: boolean;
  sourceName: string;
  updatedAt?: number;
  webhookUrl: string;
};
