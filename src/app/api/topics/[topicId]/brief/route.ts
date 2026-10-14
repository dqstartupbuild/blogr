import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateTopic } from "@/local/server/mutateTopic";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { discoverTopicIdeasForProduct } from "@/server/topics/discoverTopicIdeasForProduct";
import { buildTopicBriefNotesForKeyword } from "@/server/topics/buildTopicBriefNotesForKeyword";
import { topicDiscoverRequestSchema } from "../../discover/schema";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    assertLocalRequest(request);
    const input = topicDiscoverRequestSchema.parse(await readLocalJson(request));
    const { topicId } = await params;
    const state = await readLocalState();
    const topic = state.topics.find((item) => item.id === topicId && item.productId === input.productId);
    if (!topic) throw new Error("Topic not found.");
    const product = state.products.find((item) => item.id === topic.productId);
    if (!product) throw new Error("Project not found.");
    if (topic.blogId || topic.status === "written" || topic.status === "published") throw new Error("This brief is locked because its article is already written.");
    const discovery = await discoverTopicIdeasForProduct({ existingBlogs: state.blogs.filter((item) => item.productId === product.id).map((item) => ({ keyword: item.keyword, title: item.title, excerpt: item.excerpt, updatedAt: item.updatedAt })), existingTopics: state.topics.filter((item) => item.productId === product.id).map((item) => item.keyword), includeAiAnswers: input.includeAiAnswers, product, seedKeyword: input.seedKeyword || topic.keyword });
    const notes = buildTopicBriefNotesForKeyword({ discovery, keyword: topic.keyword });
    if (!notes.trim()) throw new Error("No search brief was found for this topic.");
    const latest = await readLocalState();
    await updateLocalState(latest.revision, (next) => {
      const current = next.topics.find((item) => item.id === topicId && item.productId === input.productId);
      const currentProduct = next.products.find((item) => item.id === product.id);
      if (!current || current.updatedAt !== topic.updatedAt || !currentProduct || currentProduct.updatedAt !== product.updatedAt || current.blogId || current.status === "written" || current.status === "published") throw new Error("This project or topic changed while the brief was being prepared. Review it before trying again.");
      return mutateTopic(next, "updateTopicNotesMutation", { notes, productId: input.productId, topicId });
    });
    return NextResponse.json({ notes }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
