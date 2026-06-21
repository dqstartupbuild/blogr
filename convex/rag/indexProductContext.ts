import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { buildProductRagNamespace } from "./buildProductRagNamespace";
import { buildProductRagText } from "./buildProductRagText";
import { productRag } from "./client";
import { productRagKey } from "./productRagKey";

const linkValidator = v.object({
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

export const indexProductContext = action({
  args: {
    productId: v.id("products"),
    websiteUrl: v.string(),
    name: v.string(),
    description: v.string(),
    niche: v.string(),
    audience: v.string(),
    competitors: v.string(),
    siteLinks: v.array(linkValidator),
    rawContext: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(internal.products.getProductForRag.getProductForRag, {
      productId: args.productId,
    });

    if (!product) {
      throw new Error("Workspace not found.");
    }

    if (!args.rawContext.trim() && args.siteLinks.length === 0) {
      return {
        indexed: false,
      };
    }

    const result = await productRag.add(ctx, {
      key: productRagKey,
      namespace: buildProductRagNamespace(args.productId),
      text: buildProductRagText(args),
      title: `${args.name || args.websiteUrl} product context`,
    });

    return {
      indexed: result.status === "ready",
    };
  },
});
