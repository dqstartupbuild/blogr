import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { discoverTopicIdeasForProduct } from "@/server/topics/discoverTopicIdeasForProduct";
import { topicDiscoverRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try {
    assertLocalRequest(request);
    const input = topicDiscoverRequestSchema.parse(await readLocalJson(request));
    const discovery = await discoverTopicIdeasForProduct({ existingBlogs: input.existingBlogs, existingTopics: input.existingTopics.map((topic) => topic.keyword), includeAiAnswers: input.includeAiAnswers, product: input.product, seedKeyword: input.seedKeyword });
    return NextResponse.json({ discovery }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
