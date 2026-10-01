import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalState } from "@/local/server/readLocalState";
import { buildLocalExport } from "@/local/server/buildLocalExport";
import { localErrorResponse } from "@/local/server/localErrorResponse";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try { assertLocalRequest(request); const bytes = await buildLocalExport(await readLocalState()); return new Response(bytes, { headers: { "Content-Type": "application/zip", "Content-Disposition": 'attachment; filename="blogr-backup.zip"', "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
