import { NextResponse } from "next/server";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
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

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
