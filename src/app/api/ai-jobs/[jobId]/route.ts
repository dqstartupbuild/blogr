import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castAiJobId } from "@/server/convex/castAiJobId";
import { getAiJobQuery } from "@/server/convex/references/getAiJobQuery";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { PublicError } from "@/server/http/PublicError";

type AiJobStatusRouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(
  _request: Request,
  context: AiJobStatusRouteContext,
) {
  try {
    await requireRouteUserId();

    const { jobId: rawJobId } = await context.params;
    const token = await getConvexAuthToken();
    const job = await fetchQuery(
      getAiJobQuery,
      { jobId: castAiJobId(rawJobId) },
      { token },
    );

    if (!job) {
      throw new PublicError("Background job not found.", 404);
    }

    return NextResponse.json({
      error: job.error,
      result: job.result,
      status: job.status,
    });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
