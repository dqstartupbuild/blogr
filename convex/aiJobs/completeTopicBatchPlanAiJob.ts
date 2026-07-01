import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicIntentKey } from "../topics/buildTopicIntentKey";
import { buildTopicSearchText } from "../topics/buildTopicSearchText";
import { normalizeTopicKeyword } from "../topics/normalizeTopicKeyword";
import { topicSourceTypeValidator } from "../topics/topicSourceTypeValidator";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";

const scheduledTopicValidator = v.object({
  canonicalKeyword: v.optional(v.string()),
  intentKey: v.optional(v.string()),
  keyword: v.string(),
  notes: v.optional(v.string()),
  scheduledDate: v.string(),
  sourceType: v.optional(topicSourceTypeValidator),
});

export const completeTopicBatchPlanAiJob = mutation({
  args: {
    jobId: v.id("aiJobs"),
    productId: v.id("products"),
    secret: v.string(),
    topics: v.array(scheduledTopicValidator),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);
    const product = await ctx.db.get(args.productId);

    if (!job || job.type !== "topic.batchPlan") {
      throw new Error("AI job not found.");
    }

    if (!product || product.userId !== job.userId) {
      throw new Error("Workspace not found.");
    }

    const occupiedDates = new Set<string>();
    const existingKeys = new Set<string>();
    const topicsQuery = ctx.db
      .query("topicKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", job.userId).eq("productId", args.productId),
      );

    for await (const topic of topicsQuery) {
      if (topic.scheduledDate) {
        occupiedDates.add(topic.scheduledDate);
      }

      existingKeys.add(topic.keyword.trim().toLowerCase());

      if (topic.canonicalKeyword) {
        existingKeys.add(topic.canonicalKeyword.trim().toLowerCase());
      }

      existingKeys.add(topic.intentKey || buildTopicIntentKey(topic.keyword));
    }

    const blogsQuery = ctx.db
      .query("blogKeywordOptions")
      .withIndex("by_userId_productId_updatedAt", (q) =>
        q.eq("userId", job.userId).eq("productId", args.productId),
      );

    for await (const blog of blogsQuery) {
      existingKeys.add(blog.keyword.trim().toLowerCase());
      existingKeys.add(buildTopicIntentKey(blog.keyword));
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of args.topics) {
      const keyword = normalizeTopicKeyword(item.keyword);
      const canonicalKeyword = normalizeTopicKeyword(
        item.canonicalKeyword || keyword,
      );
      const intentKey =
        item.intentKey?.trim() ||
        buildTopicIntentKey(canonicalKeyword) ||
        canonicalKeyword.toLowerCase();
      const lowerKeyword = keyword.toLowerCase();

      if (
        !keyword ||
        occupiedDates.has(item.scheduledDate) ||
        existingKeys.has(lowerKeyword) ||
        existingKeys.has(intentKey)
      ) {
        skippedCount += 1;
        continue;
      }

      const notes = item.notes?.trim();
      const sourceType = item.sourceType || "discovery";

      const topic = {
        canonicalKeyword,
        createdAt: now,
        intentKey,
        keyword,
        notes: notes || undefined,
        productId: args.productId,
        scheduledDate: item.scheduledDate,
        searchText: buildTopicSearchText({
          canonicalKeyword,
          intentKey,
          keyword,
          notes,
          scheduledDate: item.scheduledDate,
          sourceType,
        }),
        sourceType,
        status: "scheduled",
        updatedAt: now,
        userId: job.userId,
      } as const;
      const topicId = await ctx.db.insert("topics", topic);

      await upsertTopicReadModel(ctx, {
        ...topic,
        _id: topicId,
      });

      occupiedDates.add(item.scheduledDate);
      existingKeys.add(lowerKeyword);
      existingKeys.add(canonicalKeyword.toLowerCase());
      existingKeys.add(intentKey);
      createdCount += 1;
    }

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: { createdCount, skippedCount, topics: args.topics },
      status: "succeeded",
      updatedAt: now,
    });

    return { createdCount, skippedCount };
  },
});
