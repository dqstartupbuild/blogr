import { NextResponse } from "next/server";
import { z } from "zod";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { executeLocalMutation } from "@/local/application/executeLocalMutation";
import { fileLocalWorkspaceRepository } from "@/local/server/fileLocalWorkspaceRepository";
import { withPublishingAvailability } from "@/local/server/withPublishingAvailability";

export const runtime = "nodejs";
const schema = z.object({ name: z.string().min(1).max(80), args: z.record(z.string(), z.unknown()).optional(), expectedRevision: z.number().int().nonnegative() });
export async function POST(request: Request) {
  try { assertLocalRequest(request); const input = schema.parse(await readLocalJson(request)); const outcome = await executeLocalMutation(fileLocalWorkspaceRepository, input.name, input.args || {}, input.expectedRevision); return NextResponse.json({ ...outcome, state: withPublishingAvailability(outcome.state) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
