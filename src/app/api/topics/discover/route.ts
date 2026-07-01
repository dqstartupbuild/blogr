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
import { discoverTopicIdeasForProduct } from "@/server/topics/discoverTopicIdeasForProduct";
import { topicDiscoverRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = topicDiscoverRequestSchema.parse(body);
    const productId = input.productId ? castProductId(input.productId) : undefined;

    if (hasBlogAiWorkerJob()) {
      const token = await getConvexAuthToken();
      const jobId = await createBlogAiJob({
        input: {
          input: {
            ...input,
            productId: undefined,
          },
          type: "topic.discover",
        },
        productId,
        token,
      });
      const job = await waitForBlogAiJob({ jobId, token });

      if (job?.status === "failed") {
        throw new Error(job.error || "Could not find topic ideas yet.");
      }

      return NextResponse.json(
        {
          discovery: (job?.result as { discovery?: unknown } | undefined)
            ?.discovery,
          jobId,
          status: job?.status || "queued",
        },
        { status: job?.status === "succeeded" ? 200 : 202 },
      );
    }

    const discovery = await discoverTopicIdeasForProduct({
      existingBlogs: input.existingBlogs,
      existingTopics: input.existingTopics.map((topic) => topic.keyword),
      includeAiAnswers: input.includeAiAnswers,
      product: input.product,
      seedKeyword: input.seedKeyword,
    });

    return NextResponse.json({ discovery });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
