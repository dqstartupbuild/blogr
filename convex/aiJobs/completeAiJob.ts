import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";

export const completeAiJob = mutation({
  args: {
    jobId: v.id("aiJobs"),
    result: v.optional(v.any()),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: args.result,
      status: "succeeded",
      updatedAt: now,
    });
  },
});
