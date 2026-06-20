import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { mapConvexBlog } from "@/features/workspace/mappers/mapConvexBlog";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castBlogId } from "@/server/convex/castBlogId";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { buildBlogZip } from "@/server/download/buildBlogZip";
import { safeFilename } from "@/server/download/safeFilename";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";

type BlogDownloadRouteContext = {
  params: Promise<{ blogId: string }>;
};

export async function GET(_request: Request, context: BlogDownloadRouteContext) {
  try {
    await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before downloading live blogs.");
    }

    const token = await getConvexAuthToken();
    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const blog = await fetchQuery(getBlogQuery, { blogId }, { token });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const blogItem = mapConvexBlog(blog);
    const zipBytes = await buildBlogZip(blogItem);
    const filename = `${safeFilename(blogItem.slug)}.zip`;

    return new Response(zipBytes, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
