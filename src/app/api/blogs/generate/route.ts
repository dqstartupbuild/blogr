import { NextResponse } from "next/server";
import { getOptionalConvexAuthToken } from "@/server/auth/getOptionalConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { generateBlogForKeyword } from "@/server/blog/generateBlogForKeyword";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { blogGenerateRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const userId = await requireRouteUserId();
    const token = await getOptionalConvexAuthToken();

    const body = await request.json();
    const input = blogGenerateRequestSchema.parse(body);
    const blog = await generateBlogForKeyword({
      ...input,
      convexAuthToken: token,
      userId,
    });

    return NextResponse.json({ blog });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
