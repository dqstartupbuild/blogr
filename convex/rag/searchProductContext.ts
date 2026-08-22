import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { buildProductRagNamespace } from "./buildProductRagNamespace";
import { productRag } from "./client";

export const searchProductContext = action({
  args: {
    productId: v.id("products"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(internal.products.getProductForRag.getProductForRag, {
      productId: args.productId,
    });

    if (!product) {
      throw new Error("Workspace not found.");
    }

    try {
      const result = await productRag.search(ctx, {
        chunkContext: {
          after: 1,
          before: 1,
        },
        limit: 6,
        namespace: buildProductRagNamespace(args.productId),
        query: args.query,
        searchType: "hybrid",
        vectorScoreThreshold: 0.35,
      });

      return {
        text: result.text.slice(0, 6000),
      };
    } catch {
      return {
        text: "",
      };
    }
  },
});
