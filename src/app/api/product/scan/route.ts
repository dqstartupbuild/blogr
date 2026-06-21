import { NextResponse } from "next/server";
import { getOptionalConvexAuthToken } from "@/server/auth/getOptionalConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { scanProductWebsite } from "@/server/product/scanProductWebsite";
import { storeProductScanImages } from "@/server/product/storeProductScanImages";
import { indexProductRagContext } from "@/server/rag/indexProductRagContext";
import { productScanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const userId = await requireRouteUserId();
    const token = await getOptionalConvexAuthToken();

    const body = await request.json();
    const input = productScanRequestSchema.parse(body);

    const product = await scanProductWebsite({
      nicheHint: input.niche,
      websiteUrl: input.websiteUrl,
    });
    const storedProduct = await storeProductScanImages({
      product,
      token,
      userId,
    });
    await indexProductRagContext({
      product: storedProduct,
      productId: input.productId,
      token,
    });

    return NextResponse.json({ product: storedProduct });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
