import { NextResponse } from "next/server";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { buildBlogZip } from "@/server/download/buildBlogZip";
import { safeFilename } from "@/server/download/safeFilename";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { blogDownloadRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const { blog } = blogDownloadRequestSchema.parse(body);
    const zipBytes = await buildBlogZip(blog);
    const filename = `${safeFilename(blog.slug || blog.title)}.zip`;

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
