import { NextResponse } from "next/server";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castBlogId } from "@/server/convex/castBlogId";
import { fetchRouteBlog } from "@/server/convex/fetchRouteBlog";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { updateRouteBlogContent } from "@/server/convex/updateRouteBlogContent";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { blogUpdateRequestSchema } from "./schema";

type BlogRouteContext = {
  params: Promise<{ blogId: string }>;
};

export async function GET(_request: Request, context: BlogRouteContext) {
  try {
    const userId = await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before loading live blogs.");
    }

    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const blog = await fetchRouteBlog({ blogId, userId });

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
    const userId = await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before saving live blogs.");
    }

    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const body = await request.json();
    const input = blogUpdateRequestSchema.parse(body);

    await updateRouteBlogContent({
      blogId,
      excerpt: input.excerpt,
      mdx: input.mdx,
      title: input.title,
      userId,
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
