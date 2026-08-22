import { NextResponse } from "next/server";
import { assertBlogAiWorkerRequest } from "@/server/blogAiWorker/assertBlogAiWorkerRequest";
import { blogAiWorkerJobSchema } from "@/server/blogAiWorker/blogAiWorkerJobSchema";
import { runBlogAiWorkerJob } from "@/server/blogAiWorker/runBlogAiWorkerJob";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";

export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    assertBlogAiWorkerRequest(request);

    return NextResponse.json({ ok: true, worker: "blog-ai" });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}

export async function POST(request: Request) {
  try {
    assertBlogAiWorkerRequest(request);

    const body = await request.json();
    const job = blogAiWorkerJobSchema.parse(body);
    const result = await runBlogAiWorkerJob(job);

    return NextResponse.json(result);
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
