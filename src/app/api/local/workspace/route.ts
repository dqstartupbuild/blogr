import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalState } from "@/local/server/readLocalState";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { withPublishingAvailability } from "@/local/server/withPublishingAvailability";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try { assertLocalRequest(request); return NextResponse.json(withPublishingAvailability(await readLocalState()), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
