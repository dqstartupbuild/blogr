import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { planTopicIdeas } from "@/server/topics/planTopicIdeas";
import { topicIdeasRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try {
    assertLocalRequest(request);
    const input = topicIdeasRequestSchema.parse(await readLocalJson(request));
    const topics = await planTopicIdeas(input);
    return NextResponse.json({ topics }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
