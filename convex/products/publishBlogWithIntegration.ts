import { v } from "convex/values";
import type { Infer } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { applyBlogPublishingSourceName } from "./applyBlogPublishingSourceName";
import { blogPublishingIntegrationValidator } from "./blogPublishingIntegrationValidator";
import { blogPublishPayloadValidator } from "./blogPublishPayloadValidator";
import { readBlogPublishingWebhookMessage } from "./readBlogPublishingWebhookMessage";

type BlogPublishingIntegration = Infer<typeof blogPublishingIntegrationValidator>;
type PublishBlogWithIntegrationResult = {
  message?: string;
  published: boolean;
};

export const publishBlogWithIntegration = action({
  args: {
    payload: blogPublishPayloadValidator,
    productId: v.id("products"),
  },
  handler: async (ctx, args): Promise<PublishBlogWithIntegrationResult> => {
    const integration = (await ctx.runQuery(
      internal.products.getBlogPublishingIntegration.getBlogPublishingIntegration,
      { productId: args.productId },
    )) as BlogPublishingIntegration | undefined;

    if (!integration?.enabled) {
      return {
        published: false,
      };
    }

    if (!integration.webhookUrl || !integration.accessToken) {
      throw new Error("Finish the publishing setup for this product first.");
    }

    const payload = applyBlogPublishingSourceName(
      args.payload,
      integration.sourceName || "Blogger",
    );
    const response: Response = await fetch(integration.webhookUrl, {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${integration.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(await readBlogPublishingWebhookMessage(response));
    }

    return {
      message: await readBlogPublishingWebhookMessage(response),
      published: true,
    };
  },
});
