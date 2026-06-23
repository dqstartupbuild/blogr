import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const updateBlogPublishingIntegration = mutation({
  args: {
    accessToken: v.optional(v.string()),
    enabled: v.boolean(),
    productId: v.id("products"),
    sourceName: v.string(),
    webhookUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    const webhookUrl = args.webhookUrl.trim();
    const sourceName = args.sourceName.trim() || "Blogger";
    const existingAccessToken =
      product.blogPublishingIntegration?.accessToken || "";
    const accessToken = args.accessToken?.trim() || existingAccessToken;

    if (args.enabled && (!webhookUrl || !accessToken)) {
      throw new Error("Add a webhook URL and access token before saving.");
    }

    await ctx.db.patch(args.productId, {
      blogPublishingIntegration: {
        accessToken: args.enabled ? accessToken : "",
        enabled: args.enabled,
        sourceName,
        updatedAt: Date.now(),
        webhookUrl: args.enabled ? webhookUrl : "",
      },
      updatedAt: Date.now(),
    });
  },
});
