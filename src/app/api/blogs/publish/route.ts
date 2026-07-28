import { fetchAction } from "convex/nextjs";
import { NextResponse } from "next/server";
import { markPublishedBlogStatus } from "./markPublishedBlogStatus";
import { blogPublishRequestSchema } from "./schema";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castProductId } from "@/server/convex/castProductId";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { publishBlogWithIntegrationAction } from "@/server/convex/references/publishBlogWithIntegrationAction";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { PublicError } from "@/server/http/PublicError";
import { buildBlogPublishPayload } from "@/server/publishing/buildBlogPublishPayload";
import { getBlogPublishEventType } from "@/server/publishing/getBlogPublishEventType";
import { getBlogPublishEnvironmentDestination } from "@/server/publishing/getBlogPublishEnvironmentDestination";
import { sendBlogPublishWebhook } from "@/server/publishing/sendBlogPublishWebhook";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const { blog } = blogPublishRequestSchema.parse(body);
    const eventType = getBlogPublishEventType(blog);
    const payload = buildBlogPublishPayload(blog, eventType);
    let convexAuthToken: string | undefined;

    if (blog.productId && hasConvexUrl()) {
      convexAuthToken = await getConvexAuthToken();
      const result = await fetchAction(
        publishBlogWithIntegrationAction,
        {
          payload,
          productId: castProductId(blog.productId),
        },
        { token: convexAuthToken },
      );

      if (result.published) {
        await markPublishedBlogStatus(blog, convexAuthToken).catch(
          () => undefined,
        );

        return NextResponse.json({
          message: result.message || "Published.",
          published: true,
        });
      }
    }

    const destination = getBlogPublishEnvironmentDestination();

    if (!destination) {
      throw new PublicError("Add a publishing integration in Settings before publishing.");
    }

    const fallbackPayload = buildBlogPublishPayload(
      blog,
      eventType,
      destination.sourceName,
    );
    const message = await sendBlogPublishWebhook(fallbackPayload, destination);
    await markPublishedBlogStatus(blog, convexAuthToken).catch(() => undefined);

    return NextResponse.json({
      message: message || "Published.",
      published: true,
    });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
