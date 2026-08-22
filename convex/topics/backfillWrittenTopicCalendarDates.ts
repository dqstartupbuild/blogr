import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicSearchText } from "./buildTopicSearchText";
import { getCalendarDateKeyFromTimestamp } from "./getCalendarDateKeyFromTimestamp";
import { resolveTopicStatusFromBlog } from "./resolveTopicStatusFromBlog";

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
      .query("blogSummaries")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", userId).eq("productId", productId),
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
        (topic.productId && topic.productId !== productId)
      ) {
        skippedCount += 1;
        continue;
      }

      const scheduledDate =
        topic.scheduledDate ||
        getCalendarDateKeyFromTimestamp(
          topic.createdAt || blog.createdAt,
          args.timeZone,
        );
      const status = resolveTopicStatusFromBlog(blog.status, topic.status);

      if (
        topic.blogId === blog.blogId &&
        topic.productId === productId &&
        topic.scheduledDate === scheduledDate &&
        topic.status === status
      ) {
        skippedCount += 1;
        continue;
      }

      const updatedTopic = {
        ...topic,
        blogId: blog.blogId,
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
        status,
        updatedAt: now,
      };

      await ctx.db.patch(topic._id, {
        blogId: updatedTopic.blogId,
        productId: updatedTopic.productId,
        scheduledDate,
        searchText: updatedTopic.searchText,
        status: updatedTopic.status,
        updatedAt: now,
      });
      await upsertTopicReadModel(ctx, updatedTopic);
      updatedCount += 1;
    }

    return { skippedCount, updatedCount };
  },
});
