import { NextResponse } from "next/server";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";

type BlogDownloadRouteContext = {
  params: Promise<{ blogId: string }>;
};

export async function GET(_request: Request, context: BlogDownloadRouteContext) {
  try {
    await requireRouteUserId();
    await context.params;

    return NextResponse.json(
      { error: "Use the download button in the app." },
      { status: 405 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
