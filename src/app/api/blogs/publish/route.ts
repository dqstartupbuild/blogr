import { fetchAction } from "convex/nextjs";
import { NextResponse } from "next/server";
import { blogPublishRequestSchema } from "./schema";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castProductId } from "@/server/convex/castProductId";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { publishBlogWithIntegrationAction } from "@/server/convex/references/publishBlogWithIntegrationAction";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { buildBlogPublishPayload } from "@/server/publishing/buildBlogPublishPayload";
import { getBlogPublishEnvironmentDestination } from "@/server/publishing/getBlogPublishEnvironmentDestination";
import { sendBlogPublishWebhook } from "@/server/publishing/sendBlogPublishWebhook";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const { blog } = blogPublishRequestSchema.parse(body);
    const payload = buildBlogPublishPayload(blog, "publish_articles");

    if (blog.productId && hasConvexUrl()) {
      const token = await getConvexAuthToken();
      const result = await fetchAction(
        publishBlogWithIntegrationAction,
        {
          payload,
          productId: castProductId(blog.productId),
        },
        { token },
      );

      if (result.published) {
        return NextResponse.json({
          message: result.message || "Published.",
          published: true,
        });
      }
    }

    const destination = getBlogPublishEnvironmentDestination();

    if (!destination) {
      throw new Error("Add a publishing integration in Settings before publishing.");
    }

    const fallbackPayload = buildBlogPublishPayload(
      blog,
      "publish_articles",
      destination.sourceName,
    );
    const message = await sendBlogPublishWebhook(fallbackPayload, destination);

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
