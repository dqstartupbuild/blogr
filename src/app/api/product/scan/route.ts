import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { getOptionalConvexAuthToken } from "@/server/auth/getOptionalConvexAuthToken";
import { createBlogAiJob } from "@/server/blogAiWorker/createBlogAiJob";
import { hasBlogAiWorkerJob } from "@/server/blogAiWorker/hasBlogAiWorkerJob";
import { waitForBlogAiJob } from "@/server/blogAiWorker/waitForBlogAiJob";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { castProductId } from "@/server/convex/castProductId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { scanAndStoreProductWebsite } from "@/server/product/scanAndStoreProductWebsite";
import { indexProductRagContext } from "@/server/rag/indexProductRagContext";
import { logRouteError } from "@/server/http/logRouteError";
import { productScanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const userId = await requireRouteUserId();

    const body = await request.json();
    const input = productScanRequestSchema.parse(body);
    const productId = input.productId ? castProductId(input.productId) : undefined;

    if (hasBlogAiWorkerJob() && productId) {
      const token = await getConvexAuthToken();
      const jobId = await createBlogAiJob({
        input: {
          convexAuthToken: token,
          input,
          type: "product.scan",
          userId,
        },
        productId,
        token,
      });
      const job = await waitForBlogAiJob({ jobId, token });

      if (job?.status === "failed") {
        throw new Error(job.error || "Could not scan that site yet.");
      }

      return NextResponse.json(
        {
          jobId,
          product: (job?.result as { product?: unknown } | undefined)?.product,
          status: job?.status || "queued",
        },
        { status: job?.status === "succeeded" ? 200 : 202 },
      );
    }

    const token = await getOptionalConvexAuthToken();
    const storedProduct = await scanAndStoreProductWebsite({
      niche: input.niche,
      token,
      userId,
      websiteUrl: input.websiteUrl,
    });

    await indexProductRagContext({
      product: storedProduct,
      productId: input.productId,
      token,
    });

    return NextResponse.json({ product: storedProduct });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
