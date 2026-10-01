import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalState } from "@/local/server/readLocalState";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { buildBlogZip } from "@/server/download/buildBlogZip";
import { safeFilename } from "@/server/download/safeFilename";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    assertLocalRequest(request);
    const { blogId } = await params;
    const blog = (await readLocalState()).blogs.find((item) => item.id === blogId);
    if (!blog) throw new Error("Article not found.");
    const bytes = await buildBlogZip(blog);
    return new Response(bytes, { headers: { "Content-Disposition": `attachment; filename="${safeFilename(blog.slug || blog.title)}.zip"`, "Content-Type": "application/zip", "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
