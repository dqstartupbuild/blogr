import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { createPartialProductScanResult } from "@/server/product/createPartialProductScanResult";
import { scanProductWebsite } from "@/server/product/scanProductWebsite";
import { storeProductScanImages } from "@/server/product/storeProductScanImages";
import type { ProductScanResult } from "@/server/product/types/ProductScanResult";
import { indexProductRagContext } from "@/server/rag/indexProductRagContext";
import { productScanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = productScanRequestSchema.parse(body);

    const token = await getConvexAuthToken();
    let storedProduct: ProductScanResult;

    try {
      const product = await scanProductWebsite({
        nicheHint: input.niche,
        websiteUrl: input.websiteUrl,
      });

      storedProduct = await storeProductScanImages({
        product,
        token,
      });
      await indexProductRagContext({
        product: storedProduct,
        productId: input.productId,
        token,
      });
    } catch {
      storedProduct = createPartialProductScanResult({
        nicheHint: input.niche,
        websiteUrl: input.websiteUrl,
      });

      return NextResponse.json({
        product: storedProduct,
        warning: "We saved your site, but could not scan the details yet.",
      });
    }

    return NextResponse.json({ product: storedProduct });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
