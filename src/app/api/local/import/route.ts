import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { importLocalExport } from "@/local/server/importLocalExport";
import { localErrorResponse } from "@/local/server/localErrorResponse";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertLocalRequest(request, 512 * 1024 * 1024);
    const expectedRevision = Number(request.headers.get("x-blogr-revision"));
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw new Error("Reload the workspace before importing.");
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > 512 * 1024 * 1024) throw new Error("Backup is larger than 512 MB.");
    const result = await importLocalExport(bytes, expectedRevision);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return localErrorResponse(error); }
}
