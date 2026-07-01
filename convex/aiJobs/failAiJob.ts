import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";

export const failAiJob = mutation({
  args: {
    error: v.string(),
    jobId: v.id("aiJobs"),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: args.error,
      leaseExpiresAt: undefined,
      status: "failed",
      updatedAt: now,
    });

    if (job?.type === "blog.generate" && job.topicId) {
      const topic = await ctx.db.get(job.topicId);

      await ctx.db.patch(job.topicId, {
        lastError: args.error,
        status: "failed",
        updatedAt: now,
      });

      if (topic) {
        await upsertTopicReadModel(ctx, {
          ...topic,
          status: "failed",
          updatedAt: now,
        });
      }
    }
  },
});
