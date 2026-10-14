import { NextResponse } from "next/server";
import { z } from "zod";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { executeLocalQuery } from "@/local/application/executeLocalQuery";
import { publishingAwareRepository } from "@/local/server/publishingAwareRepository";

export const runtime = "nodejs";
const schema = z.object({ name: z.string().min(1).max(80), args: z.record(z.string(), z.unknown()).optional() });
export async function POST(request: Request) {
  try { assertLocalRequest(request); const input = schema.parse(await readLocalJson(request)); return NextResponse.json({ result: await executeLocalQuery(publishingAwareRepository, input.name, input.args || {}) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
