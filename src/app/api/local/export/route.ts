import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalState } from "@/local/server/readLocalState";
import { buildLocalExport } from "@/local/server/buildLocalExport";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { selectWorkspaceState } from "@/local/server/selectWorkspaceState";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    assertLocalRequest(request);
    const productId = new URL(request.url).searchParams.get("productId");
    const state = await readLocalState();
    const workspace = productId ? selectWorkspaceState(state, productId) : null;
    const bytes = workspace ? await buildLocalExport(workspace, "workspace") : await buildLocalExport(state);
    const slug = workspace?.products[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
    const filename = workspace ? `blogr-${slug}-backup.zip` : "blogr-backup.zip";
    return new Response(bytes, { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "no-store" } });
  }
  catch (error) { return localErrorResponse(error); }
}
