import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { refreshProductSiteLinks } from "@/server/product/refreshProductSiteLinks";
import { productLinksRefreshRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  try { assertLocalRequest(request); const input = productLinksRefreshRequestSchema.parse(await readLocalJson(request)); return NextResponse.json({ siteLinks: await refreshProductSiteLinks(input.websiteUrl) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return localErrorResponse(error); }
}
