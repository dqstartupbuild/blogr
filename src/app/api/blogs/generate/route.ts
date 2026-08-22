import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { getOptionalConvexAuthToken } from "@/server/auth/getOptionalConvexAuthToken";
import { createBlogAiJob } from "@/server/blogAiWorker/createBlogAiJob";
import { hasBlogAiWorkerJob } from "@/server/blogAiWorker/hasBlogAiWorkerJob";
import { waitForBlogAiJob } from "@/server/blogAiWorker/waitForBlogAiJob";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { generateBlogForKeyword } from "@/server/blog/generateBlogForKeyword";
import { castProductId } from "@/server/convex/castProductId";
import { castTopicId } from "@/server/convex/castTopicId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { blogGenerateRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const userId = await requireRouteUserId();

    const body = await request.json();
    const input = blogGenerateRequestSchema.parse(body);
    const productId = input.productId ? castProductId(input.productId) : undefined;
    const topicId = input.topicId ? castTopicId(input.topicId) : undefined;

    if (hasBlogAiWorkerJob() && productId) {
      const token = await getConvexAuthToken();
      const jobId = await createBlogAiJob({
        input: {
          convexAuthToken: token,
          input,
          type: "blog.generate",
          userId,
        },
        productId,
        token,
        topicId,
      });
      const job = await waitForBlogAiJob({ jobId, token });

      if (job?.status === "failed") {
        throw new Error(job.error || "Could not write that blog yet.");
      }

      return NextResponse.json(
        {
          blogId: (job?.result as { blogId?: string } | undefined)?.blogId,
          jobId,
          status: job?.status || "queued",
        },
        { status: job?.status === "succeeded" ? 200 : 202 },
      );
    }

    const token = await getOptionalConvexAuthToken();
    const blog = await generateBlogForKeyword({
      ...input,
      convexAuthToken: token,
      userId,
    });

    return NextResponse.json({ blog });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
