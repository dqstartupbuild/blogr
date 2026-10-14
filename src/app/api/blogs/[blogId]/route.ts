import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateBlog } from "@/local/server/mutateBlog";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { blogUpdateRequestSchema } from "./schema";
export const runtime = "nodejs";
type Context = { params: Promise<{ blogId: string }> };
export async function GET(request: Request, context: Context) {
  try { assertLocalRequest(request); const { blogId } = await context.params; const state = await readLocalState(); const blog = state.blogs.find((item) => item.id === blogId); if (!blog) throw new Error("Article not found."); return NextResponse.json({ blog }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
export async function PATCH(request: Request, context: Context) {
  try { assertLocalRequest(request); const { blogId } = await context.params; const input = blogUpdateRequestSchema.parse(await readLocalJson(request)); const state = await readLocalState(); const blog = state.blogs.find((item) => item.id === blogId); if (!blog) throw new Error("Article not found."); await updateLocalState(state.revision, (next) => mutateBlog(next, "updateBlogContentMutation", { ...input, blogId, productId: blog.productId })); return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
