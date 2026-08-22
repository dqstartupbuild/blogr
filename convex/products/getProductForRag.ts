import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getProductForRag = internalQuery({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      return null;
    }

    return product;
  },
});
