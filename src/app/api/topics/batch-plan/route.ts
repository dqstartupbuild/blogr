import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { planTopicBatch } from "@/server/topics/planTopicBatch";
import { topicBatchPlanRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try {
    assertLocalRequest(request);
    const input = topicBatchPlanRequestSchema.parse(await readLocalJson(request));
    const topics = await planTopicBatch({ ...input, blankDates: [...new Set(input.blankDates)].slice(0,30) });
    return NextResponse.json({ topics }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
