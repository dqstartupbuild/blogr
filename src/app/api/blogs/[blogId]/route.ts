import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castBlogId } from "@/server/convex/castBlogId";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { updateBlogContentMutation } from "@/server/convex/references/updateBlogContentMutation";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { blogUpdateRequestSchema } from "./schema";

type BlogRouteContext = {
  params: Promise<{ blogId: string }>;
};

export async function GET(_request: Request, context: BlogRouteContext) {
  try {
    await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before loading live blogs.");
    }

    const token = await getConvexAuthToken();
    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const blog = await fetchQuery(getBlogQuery, { blogId }, { token });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}

export async function PATCH(request: Request, context: BlogRouteContext) {
  try {
    await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before saving live blogs.");
    }

    const token = await getConvexAuthToken();
    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const body = await request.json();
    const input = blogUpdateRequestSchema.parse(body);

    await fetchMutation(
      updateBlogContentMutation,
      {
        blogId,
        excerpt: input.excerpt,
        mdx: input.mdx,
        seoTitle: input.seoTitle,
        title: input.title,
      },
      { token },
    );

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
