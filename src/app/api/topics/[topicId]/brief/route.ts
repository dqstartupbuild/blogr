import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { createBlogAiJob } from "@/server/blogAiWorker/createBlogAiJob";
import { hasBlogAiWorkerJob } from "@/server/blogAiWorker/hasBlogAiWorkerJob";
import { waitForBlogAiJob } from "@/server/blogAiWorker/waitForBlogAiJob";
import { castProductId } from "@/server/convex/castProductId";
import { castTopicId } from "@/server/convex/castTopicId";
import { getTopicQuery } from "@/server/convex/references/getTopicQuery";
import { updateTopicNotesMutation } from "@/server/convex/references/updateTopicNotesMutation";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { PublicError } from "@/server/http/PublicError";
import { buildTopicBriefNotesForKeyword } from "@/server/topics/buildTopicBriefNotesForKeyword";
import { discoverTopicIdeasForProduct } from "@/server/topics/discoverTopicIdeasForProduct";
import { getTopicBriefFailureMessage } from "@/server/topics/getTopicBriefFailureMessage";
import { normalizeTopicBriefRouteError } from "@/server/topics/normalizeTopicBriefRouteError";
import { topicDiscoverRequestSchema } from "../../discover/schema";

type TopicBriefRouteContext = {
  params: Promise<{ topicId: string }>;
};

export const maxDuration = 300;

export async function POST(request: Request, context: TopicBriefRouteContext) {
  try {
    await requireRouteUserId();

    const token = await getConvexAuthToken();
    const { topicId: rawTopicId } = await context.params;
    const topicId = castTopicId(rawTopicId);
    const body = await request.json();
    const input = topicDiscoverRequestSchema.parse(body);
    const productId = input.productId ? castProductId(input.productId) : undefined;
    const topic = await fetchQuery(
      getTopicQuery,
      { productId, topicId },
      { token },
    );

    if (!topic) {
      throw new PublicError("Topic not found.", 404);
    }

    if (topic.blogId || topic.status === "written") {
      throw new PublicError(
        "This brief is locked because its article is already written.",
        409,
      );
    }

    if (hasBlogAiWorkerJob()) {
      let jobId;

      try {
        jobId = await createBlogAiJob({
          input: {
            input: {
              ...input,
              productId: undefined,
              seedKeyword: input.seedKeyword || topic.keyword,
              topicId: rawTopicId,
              topicKeyword: topic.keyword,
            },
            type: "topic.brief",
          },
          productId,
          token,
          topicId,
        });
      } catch (workerError) {
        logRouteError(workerError);
      }

      if (jobId) {
        const job = await waitForBlogAiJob({ jobId, token });

        if (job?.status === "failed") {
          throw new PublicError(
            getTopicBriefFailureMessage(
              new Error(job.error || "Topic brief worker failed."),
            ),
            502,
          );
        }

        return NextResponse.json(
          {
            jobId,
            notes: (job?.result as { notes?: string } | undefined)?.notes,
            status: job?.status || "queued",
          },
          { status: job?.status === "succeeded" ? 200 : 202 },
        );
      }
    }

    const discovery = await discoverTopicIdeasForProduct({
      existingBlogs: input.existingBlogs,
      existingTopics: input.existingTopics.map((item) => item.keyword),
      includeAiAnswers: input.includeAiAnswers,
      product: input.product,
      seedKeyword: input.seedKeyword || topic.keyword,
    });
    const notes = buildTopicBriefNotesForKeyword({
      discovery,
      keyword: topic.keyword,
    });

    if (!notes.trim()) {
      throw new PublicError("No search brief was found for this topic.");
    }

    await fetchMutation(
      updateTopicNotesMutation,
      {
        notes,
        productId,
        topicId,
      },
      { token },
    );

    return NextResponse.json({ notes });
  } catch (error) {
    logRouteError(error);
    const routeError = normalizeTopicBriefRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(routeError) },
      { status: getErrorStatus(routeError) },
    );
  }
}
