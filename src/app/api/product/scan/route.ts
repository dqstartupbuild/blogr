import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { saveProductScanMutation } from "@/server/convex/references/saveProductScanMutation";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { scanProductWebsite } from "@/server/product/scanProductWebsite";
import { productScanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = productScanRequestSchema.parse(body);
    const product = await scanProductWebsite({
      nicheHint: input.niche,
      websiteUrl: input.websiteUrl,
    });

    if (hasConvexUrl()) {
      const token = await getConvexAuthToken();
      await fetchMutation(saveProductScanMutation, product, { token });
    }

    return NextResponse.json({ product, saved: hasConvexUrl() });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
