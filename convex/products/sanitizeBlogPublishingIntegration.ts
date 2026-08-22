import type { Doc } from "../_generated/dataModel";

export const sanitizeBlogPublishingIntegration = (
  integration: Doc<"products">["blogPublishingIntegration"],
) => {
  if (!integration) {
    return undefined;
  }

  return {
    enabled: integration.enabled,
    hasAccessToken: Boolean(integration.accessToken),
    sourceName: integration.sourceName,
    updatedAt: integration.updatedAt,
    webhookUrl: integration.webhookUrl,
  };
};
