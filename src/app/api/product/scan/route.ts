import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateProduct } from "@/local/server/mutateProduct";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { scanAndStoreProductWebsite } from "@/server/product/scanAndStoreProductWebsite";
import { productScanRequestSchema } from "./schema";
import { mergeProductLinkStates } from "@/features/workspace/utils/mergeProductLinkStates";
import { withManagedMediaScope } from "@/local/server/withManagedMediaScope";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  try { return await withManagedMediaScope(async () => {
    assertLocalRequest(request);
    const input = productScanRequestSchema.parse(await readLocalJson(request));
    const before = await readLocalState();
    const original = before.products.find((item) => item.id === input.productId);
    if (input.productId && !original) throw new Error("Workspace not found.");
    const product = await scanAndStoreProductWebsite({ websiteUrl: input.websiteUrl, niche: input.niche });
    const state = await readLocalState();
    const existing = state.products.find((item) => item.id === input.productId);
    const siteLinks = existing ? mergeProductLinkStates({ currentLinks: existing.siteLinks, refreshedLinks: product.siteLinks }) : product.siteLinks;
    const saved = await updateLocalState(state.revision, (next) => {
      const current = next.products.find((item) => item.id === input.productId);
      if (original && (!current || current.updatedAt !== original.updatedAt)) throw new Error("This project changed during the scan. Review it before trying again.");
      return mutateProduct(next, "saveProductScanMutation", { ...product, siteLinks, productId: input.productId });
    });
    return NextResponse.json({ product, productId: saved.result }, { headers: { "Cache-Control": "no-store" } });
  });
  } catch (error) { return localErrorResponse(error); }
}
