import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

export const getAiJob = query({
  args: {
    jobId: v.id("aiJobs"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const job = await ctx.db.get(args.jobId);

    if (!job || job.userId !== userId) {
      return null;
    }

    return job;
  },
});
