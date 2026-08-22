import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { findBlogSummaryByBlogId } from "../readModels/findBlogSummaryByBlogId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { aiJobTypeValidator } from "./aiJobTypeValidator";

export const createAiJob = mutation({
  args: {
    blogId: v.optional(v.id("blogs")),
    input: v.any(),
    productId: v.optional(v.id("products")),
    topicId: v.optional(v.id("topics")),
    type: aiJobTypeValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    if (args.productId) {
      await resolveActiveProductId(ctx, userId, args.productId);
    }

    const topic = args.topicId ? await ctx.db.get(args.topicId) : null;
    if (args.topicId) {
      if (
        !topic ||
        topic.userId !== userId ||
        (args.productId && topic.productId && topic.productId !== args.productId)
      ) {
        throw new Error("Topic not found in this workspace.");
      }
    }

    if (args.blogId) {
      const blogSummary = await findBlogSummaryByBlogId(ctx, args.blogId);

      if (
        blogSummary &&
        blogSummary.userId === userId &&
        (!args.productId || blogSummary.productId === args.productId)
      ) {
        // The summary is enough to validate this job without reading MDX.
      } else {
        const blog = await ctx.db.get(args.blogId);

        if (
          !blog ||
          blog.userId !== userId ||
          (args.productId && blog.productId && blog.productId !== args.productId)
        ) {
          throw new Error("Blog not found in this workspace.");
        }
      }
    }

    if (args.type === "blog.generate" && args.topicId && topic) {
      const updatedTopic = {
        ...topic,
        lastError: undefined,
        productId: args.productId || topic.productId,
        status: "writing" as const,
        updatedAt: now,
      };

      if (!updatedTopic.productId) {
        throw new Error("Choose a workspace first.");
      }

      await ctx.db.patch(args.topicId, {
        lastError: undefined,
        productId: updatedTopic.productId,
        status: "writing",
        updatedAt: now,
      });
      await upsertTopicReadModel(ctx, updatedTopic);
    }

    const jobId = await ctx.db.insert("aiJobs", {
      attempts: 0,
      blogId: args.blogId,
      createdAt: now,
      input: args.input,
      productId: args.productId,
      status: "queued",
      topicId: args.topicId,
      type: args.type,
      updatedAt: now,
      userId,
    });

    return jobId;
  },
});
