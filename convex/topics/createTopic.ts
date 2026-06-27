import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { buildTopicSearchText } from "./buildTopicSearchText";
import { normalizeTopicKeyword } from "./normalizeTopicKeyword";

export const createTopic = mutation({
  args: {
    productId: v.id("products"),
    keyword: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const product = await ctx.db.get(args.productId);
    const keyword = normalizeTopicKeyword(args.keyword);
    const notes = args.notes?.trim();

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    if (!keyword) {
      throw new Error("Add a keyword first.");
    }

    const now = Date.now();

    return await ctx.db.insert("topics", {
      userId,
      productId: args.productId,
      keyword,
      searchText: buildTopicSearchText({ keyword, notes }),
      notes: notes || undefined,
      status: "saved",
      createdAt: now,
      updatedAt: now,
    });
  },
});
