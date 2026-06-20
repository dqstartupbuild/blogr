import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { generateBlogForKeyword } from "@/server/blog/generateBlogForKeyword";
import type { StoredProduct } from "@/server/blog/types/StoredProduct";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { getTopicQuery } from "@/server/convex/references/getTopicQuery";
import { updateTopicStatusMutation } from "@/server/convex/references/updateTopicStatusMutation";
import { upsertGeneratedBlogMutation } from "@/server/convex/references/upsertGeneratedBlogMutation";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { blogGenerateRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  let topicId = "";

  try {
    await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before writing live blogs.");
    }

    const token = await getConvexAuthToken();
    const body = await request.json();
    const input = blogGenerateRequestSchema.parse(body);
    topicId = input.topicId;

    await fetchMutation(
      updateTopicStatusMutation,
      { status: "writing", topicId },
      { token },
    );

    const [topic, product] = await Promise.all([
      fetchQuery(getTopicQuery, { topicId }, { token }),
      fetchQuery(getCurrentProductQuery, {}, { token }),
    ]);

    if (!topic) throw new Error("Topic not found.");
    if (!product) throw new Error("Scan your product website first.");

    const blog = await generateBlogForKeyword({
      keyword: topic.keyword,
      product: product as StoredProduct,
    });
    const blogId = await fetchMutation(
      upsertGeneratedBlogMutation,
      { ...blog, topicId },
      { token },
    );

    return NextResponse.json({ blogId });
  } catch (error) {
    if (topicId && hasConvexUrl()) {
      const token = await getConvexAuthToken();
      await fetchMutation(
        updateTopicStatusMutation,
        {
          lastError: getPublicErrorMessage(error),
          status: "failed",
          topicId,
        },
        { token },
      ).catch(() => undefined);
    }

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
