import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { scanProductWebsite } from "@/server/product/scanProductWebsite";
import { storeProductScanImages } from "@/server/product/storeProductScanImages";
import { productScanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = productScanRequestSchema.parse(body);

    const token = await getConvexAuthToken();
    const product = await scanProductWebsite({
      nicheHint: input.niche,
      websiteUrl: input.websiteUrl,
    });
    const storedProduct = await storeProductScanImages({
      product,
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
