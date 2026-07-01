import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertProductProfile } from "./upsertProductProfile";
import { upsertProductWorkspaceSummary } from "./upsertProductWorkspaceSummary";

export const ensureProductWorkspaceSummaries = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const products = await ctx.db
      .query("products")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();

    for (const product of products) {
      await upsertProductWorkspaceSummary(ctx, product);
      await upsertProductProfile(ctx, product);
    }

    return { productCount: products.length };
  },
});
