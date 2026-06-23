import { NextResponse } from "next/server";
import { blogPublishRequestSchema } from "./schema";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { buildBlogPublishPayload } from "@/server/publishing/buildBlogPublishPayload";
import { sendBlogPublishWebhook } from "@/server/publishing/sendBlogPublishWebhook";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const { blog } = blogPublishRequestSchema.parse(body);
    const payload = buildBlogPublishPayload(blog, "publish_articles");
    const message = await sendBlogPublishWebhook(payload);

    return NextResponse.json({
      message: message || "Published.",
      published: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
