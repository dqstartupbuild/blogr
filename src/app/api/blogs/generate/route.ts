import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateBlog } from "@/local/server/mutateBlog";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { generateBlogForKeyword } from "@/server/blog/generateBlogForKeyword";
import { blogGenerateRequestSchema } from "./schema";
import { withManagedMediaScope } from "@/local/server/withManagedMediaScope";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try { return await withManagedMediaScope(async () => {
    assertLocalRequest(request);
    const input = blogGenerateRequestSchema.parse(await readLocalJson(request));
    const state = await readLocalState();
    const product = state.products.find((item) => item.id === input.productId);
    if (!product) throw new Error("Workspace not found.");
    const topic = input.topicId ? state.topics.find((item) => item.id === input.topicId && item.productId === product.id) : undefined;
    if (input.topicId && !topic) throw new Error("Topic not found.");
    const originalBlog = topic?.blogId ? state.blogs.find((item) => item.id === topic.blogId) : undefined;
    const blog = await generateBlogForKeyword({ ...input, product });
    const latest = await readLocalState();
    const saved = await updateLocalState(latest.revision, (next) => {
      const currentProduct = next.products.find((item) => item.id === product.id);
      const currentTopic = topic ? next.topics.find((item) => item.id === topic.id && item.productId === product.id) : undefined;
      const currentBlog = originalBlog ? next.blogs.find((item) => item.id === originalBlog.id) : undefined;
      if (!currentProduct || currentProduct.updatedAt !== product.updatedAt || (topic && (!currentTopic || currentTopic.updatedAt !== topic.updatedAt)) || (originalBlog && (!currentBlog || currentBlog.updatedAt !== originalBlog.updatedAt))) throw new Error("This project changed while the article was being written. Review it before trying again.");
      return mutateBlog(next, "upsertGeneratedBlogMutation", { ...blog, productId: product.id, topicId: input.topicId });
    });
    return NextResponse.json({ blogId: saved.result, blog }, { headers: { "Cache-Control": "no-store" } });
  });
  } catch (error) { return localErrorResponse(error); }
}
