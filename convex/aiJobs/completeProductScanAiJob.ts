import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { upsertProductProfile } from "../readModels/upsertProductProfile";
import { upsertProductWorkspaceSummary } from "../readModels/upsertProductWorkspaceSummary";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";
import { linkValidator } from "./linkValidator";

export const completeProductScanAiJob = mutation({
  args: {
    assetKeys: v.optional(v.array(v.string())),
    assets: v.array(v.string()),
    audience: v.string(),
    colors: v.array(v.string()),
    competitors: v.string(),
    description: v.string(),
    jobId: v.id("aiJobs"),
    name: v.string(),
    niche: v.string(),
    productId: v.id("products"),
    productImageKeys: v.optional(v.array(v.string())),
    productImages: v.array(v.string()),
    rawContext: v.string(),
    secret: v.string(),
    siteLinks: v.array(linkValidator),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);
    const product = await ctx.db.get(args.productId);

    if (!job || job.type !== "product.scan") {
      throw new Error("AI job not found.");
    }

    if (!product || product.userId !== job.userId) {
      throw new Error("Workspace not found.");
    }

    const existingLinkState = new Map(
      product.siteLinks.map((link) => [link.url, link]),
    );
    const siteLinks = args.siteLinks.map((link) => {
      const existing = existingLinkState.get(link.url);

      return existing
        ? {
            ...link,
            isActive: existing.isActive,
            reason: existing.reason || link.reason,
          }
        : link;
    });
    const savedProduct = {
      assetKeys: args.assetKeys,
      assets: args.assets,
      audience: args.audience,
      colors: args.colors,
      competitors: args.competitors,
      description: args.description,
      name: args.name,
      niche: args.niche,
      productImageKeys: args.productImageKeys,
      productImages: args.productImages,
      rawContext: args.rawContext,
      siteLinks,
      websiteUrl: args.websiteUrl,
    };

    await ctx.db.patch(args.productId, {
      ...savedProduct,
      scannedAt: now,
      updatedAt: now,
    });
    await upsertProductWorkspaceSummary(ctx, {
      ...product,
      ...savedProduct,
      updatedAt: now,
    });
    await upsertProductProfile(ctx, {
      ...product,
      ...savedProduct,
      updatedAt: now,
    });

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: { product: savedProduct },
      status: "succeeded",
      updatedAt: now,
    });
  },
});
