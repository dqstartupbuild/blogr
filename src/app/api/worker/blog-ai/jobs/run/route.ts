import { NextResponse } from "next/server";
import { assertBlogAiWorkerRequest } from "@/server/blogAiWorker/assertBlogAiWorkerRequest";
import { claimAndRunBlogAiJob } from "@/server/blogAiWorker/claimAndRunBlogAiJob";
import { getBlogAiWorkerMaxJobs } from "@/server/blogAiWorker/getBlogAiWorkerMaxJobs";
import { getBlogAiWorkerSecret } from "@/server/blogAiWorker/getBlogAiWorkerSecret";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    assertBlogAiWorkerRequest(request);

    const body = (await request.json().catch(() => ({}))) as {
      maxJobs?: unknown;
    };
    const maxJobs = getBlogAiWorkerMaxJobs(body.maxJobs);
    const secret = getBlogAiWorkerSecret();
    const results = [];

    for (let index = 0; index < maxJobs; index += 1) {
      const result = await claimAndRunBlogAiJob({ secret });
      results.push(result);

      if (!result.claimed) {
        break;
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
