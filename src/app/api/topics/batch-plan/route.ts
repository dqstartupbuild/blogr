import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { createBlogAiJob } from "@/server/blogAiWorker/createBlogAiJob";
import { hasBlogAiWorkerJob } from "@/server/blogAiWorker/hasBlogAiWorkerJob";
import { waitForBlogAiJob } from "@/server/blogAiWorker/waitForBlogAiJob";
import { castProductId } from "@/server/convex/castProductId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { planTopicBatch } from "@/server/topics/planTopicBatch";
import { topicBatchPlanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = topicBatchPlanRequestSchema.parse(body);
    const blankDates = Array.from(new Set(input.blankDates)).slice(0, 30);

    if (blankDates.length === 0) {
      return NextResponse.json({ topics: [] });
    }

    const productId = castProductId(input.productId);

    if (hasBlogAiWorkerJob()) {
      const token = await getConvexAuthToken();
      const jobId = await createBlogAiJob({
        input: {
          input: {
            ...input,
            blankDates,
          },
          type: "topic.batchPlan",
        },
        productId,
        token,
      });
      const job = await waitForBlogAiJob({ jobId, token });
      const result = job?.result as
        | { createdCount?: number; skippedCount?: number; topics?: unknown[] }
        | undefined;

      if (job?.status === "failed") {
        throw new Error(job.error || "Could not fill the calendar yet.");
      }

      return NextResponse.json(
        {
          createdCount: result?.createdCount,
          jobId,
          skippedCount: result?.skippedCount,
          status: job?.status || "queued",
          topics: result?.topics,
        },
        { status: job?.status === "succeeded" ? 200 : 202 },
      );
    }

    const topics = await planTopicBatch({
      ...input,
      blankDates,
    });

    return NextResponse.json({ topics });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
