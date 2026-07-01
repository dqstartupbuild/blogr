import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";

export const claimNextAiJob = mutation({
  args: {
    leaseMs: v.number(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const queuedJob = await ctx.db
      .query("aiJobs")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "queued"))
      .order("asc")
      .first();
    const staleRunningJob = queuedJob
      ? null
      : await ctx.db
          .query("aiJobs")
          .withIndex("by_status_updatedAt", (q) => q.eq("status", "running"))
          .filter((q) => q.lt(q.field("leaseExpiresAt"), now))
          .order("asc")
          .first();
    const job = queuedJob || staleRunningJob;

    if (!job) {
      return null;
    }

    await ctx.db.patch(job._id, {
      attempts: job.attempts + 1,
      error: undefined,
      leaseExpiresAt: now + args.leaseMs,
      status: "running",
      updatedAt: now,
    });

    return {
      ...job,
      attempts: job.attempts + 1,
      leaseExpiresAt: now + args.leaseMs,
      status: "running" as const,
      updatedAt: now,
    };
  },
});
