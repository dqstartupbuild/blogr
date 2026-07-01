import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
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
      const product = await ctx.db.get(args.productId);

      if (!product || product.userId !== userId) {
        throw new Error("Workspace not found.");
      }
    }

    if (args.topicId) {
      const topic = await ctx.db.get(args.topicId);

      if (
        !topic ||
        topic.userId !== userId ||
        (args.productId && topic.productId && topic.productId !== args.productId)
      ) {
        throw new Error("Topic not found in this workspace.");
      }
    }

    if (args.blogId) {
      const blog = await ctx.db.get(args.blogId);

      if (
        !blog ||
        blog.userId !== userId ||
        (args.productId && blog.productId && blog.productId !== args.productId)
      ) {
        throw new Error("Blog not found in this workspace.");
      }
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

    if (args.type === "blog.generate" && args.topicId) {
      await ctx.db.patch(args.topicId, {
        lastError: undefined,
        productId: args.productId,
        status: "writing",
        updatedAt: now,
      });
    }

    return jobId;
  },
});
