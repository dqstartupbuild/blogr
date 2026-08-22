import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicSearchText } from "../topics/buildTopicSearchText";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";

export const completeTopicBriefAiJob = mutation({
  args: {
    jobId: v.id("aiJobs"),
    notes: v.string(),
    productId: v.optional(v.id("products")),
    secret: v.string(),
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);
    const topic = await ctx.db.get(args.topicId);
    const notes = args.notes.trim();

    if (!job || job.type !== "topic.brief") {
      throw new Error("AI job not found.");
    }

    if (
      !topic ||
      topic.userId !== job.userId ||
      (args.productId && topic.productId && topic.productId !== args.productId)
    ) {
      throw new Error("Topic not found in this workspace.");
    }

    if (
      topic.blogId ||
      topic.status === "written" ||
      topic.status === "published"
    ) {
      throw new Error(
        "This brief is locked because its article is already written.",
      );
    }

    const updatedTopic = {
      ...topic,
      notes: notes || undefined,
      productId: topic.productId || args.productId,
      searchText: buildTopicSearchText({
        canonicalKeyword: topic.canonicalKeyword,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        notes,
        scheduledDate: topic.scheduledDate,
        sourceType: topic.sourceType,
      }),
      updatedAt: now,
    };

    await ctx.db.patch(args.topicId, {
      notes: updatedTopic.notes,
      productId: updatedTopic.productId,
      searchText: updatedTopic.searchText,
      updatedAt: now,
    });
    await upsertTopicReadModel(ctx, updatedTopic);

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: { notes },
      status: "succeeded",
      updatedAt: now,
    });
  },
});
