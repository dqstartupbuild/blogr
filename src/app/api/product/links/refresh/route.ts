import { NextResponse } from "next/server";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { refreshProductSiteLinks } from "@/server/product/refreshProductSiteLinks";
import { productLinksRefreshRequestSchema } from "./schema";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = productLinksRefreshRequestSchema.parse(body);
    const siteLinks = await refreshProductSiteLinks(input.websiteUrl);

    return NextResponse.json({ siteLinks });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
