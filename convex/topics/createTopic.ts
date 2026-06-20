import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const createTopic = mutation({
  args: {
    keyword: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const keyword = args.keyword.trim();

    if (!keyword) {
      throw new Error("Add a keyword first.");
    }

    const now = Date.now();

    return await ctx.db.insert("topics", {
      userId,
      keyword,
      notes: args.notes?.trim() || undefined,
      status: "saved",
      createdAt: now,
      updatedAt: now,
    });
  },
});
