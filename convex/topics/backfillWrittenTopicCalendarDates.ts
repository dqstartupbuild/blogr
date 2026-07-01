import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { buildTopicSearchText } from "./buildTopicSearchText";
import { getCalendarDateKeyFromTimestamp } from "./getCalendarDateKeyFromTimestamp";

export const backfillWrittenTopicCalendarDates = mutation({
  args: {
    productId: v.optional(v.id("products")),
    timeZone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const productId = await resolveActiveProductId(ctx, userId, args.productId);

    if (!productId) {
      return { skippedCount: 0, updatedCount: 0 };
    }

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("productId"), productId),
          q.eq(q.field("productId"), undefined),
        ),
      )
      .collect();
    const now = Date.now();
    let skippedCount = 0;
    let updatedCount = 0;

    for (const blog of blogs) {
      if (blog.status === "failed" || !blog.topicId) {
        skippedCount += 1;
        continue;
      }

      const topic = await ctx.db.get(blog.topicId);

      if (
        !topic ||
        topic.userId !== userId ||
        (topic.productId && topic.productId !== productId) ||
        topic.scheduledDate
      ) {
        skippedCount += 1;
        continue;
      }

      const scheduledDate = getCalendarDateKeyFromTimestamp(
        topic.createdAt || blog.createdAt,
        args.timeZone,
      );

      await ctx.db.patch(topic._id, {
        blogId: topic.blogId || blog._id,
        productId: topic.productId || blog.productId || productId,
        scheduledDate,
        searchText: buildTopicSearchText({
          canonicalKeyword: topic.canonicalKeyword,
          intentKey: topic.intentKey,
          keyword: topic.keyword,
          notes: topic.notes,
          scheduledDate,
          sourceType: topic.sourceType,
        }),
        status: topic.status === "writing" ? "writing" : "written",
        updatedAt: now,
      });
      updatedCount += 1;
    }

    return { skippedCount, updatedCount };
  },
});
