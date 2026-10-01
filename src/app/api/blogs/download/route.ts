import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { buildBlogZip } from "@/server/download/buildBlogZip";
import { safeFilename } from "@/server/download/safeFilename";
import { blogDownloadRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try {
    assertLocalRequest(request);
    const { blog: requested } = blogDownloadRequestSchema.parse(await readLocalJson(request, 6 * 1024 * 1024));
    const state = await readLocalState();
    const blog = state.blogs.find((item) => item.id === requested.id && item.productId === requested.productId);
    if (!blog) throw new Error("Article not found.");
    const draft = { ...blog, ...requested, productId: blog.productId };
    const bytes = await buildBlogZip(draft);
    return new Response(bytes, { headers: { "Content-Disposition": `attachment; filename="${safeFilename(draft.slug || draft.title)}.zip"`, "Content-Type": "application/zip", "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
