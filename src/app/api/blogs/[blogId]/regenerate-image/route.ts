import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { createBlogAiJob } from "@/server/blogAiWorker/createBlogAiJob";
import { hasBlogAiWorkerJob } from "@/server/blogAiWorker/hasBlogAiWorkerJob";
import { waitForBlogAiJob } from "@/server/blogAiWorker/waitForBlogAiJob";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { regenerateBlogImage } from "@/server/blog/regenerateBlogImage";
import { replaceImageUrlInMdx } from "@/server/blog/replaceImageUrlInMdx";
import { resolveRegenerateImageTarget } from "@/server/blog/resolveRegenerateImageTarget";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { updateBlogImageMutation } from "@/server/convex/references/updateBlogImageMutation";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { PublicError } from "@/server/http/PublicError";
import { regenerateImageRequestSchema } from "./schema";

type RegenerateImageRouteContext = {
  params: Promise<{ blogId: string }>;
};

const imageRegenerationJobWaitMs = 90000;

export const maxDuration = 120;

export async function POST(request: Request, context: RegenerateImageRouteContext) {
  try {
    const userId = await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new PublicError("Connect Convex before refreshing images.", 503);
    }

    const token = await getConvexAuthToken();
    const { blogId: rawBlogId } = await context.params;
    const blogId = castBlogId(rawBlogId);
    const body = await request.json();
    const input = regenerateImageRequestSchema.parse(body);
    const productId = input.productId ? castProductId(input.productId) : undefined;

    const blog = await fetchQuery(
      getBlogQuery,
      { blogId, productId },
      { token },
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const target = resolveRegenerateImageTarget({
      alt: input.alt,
      imageIndex: input.imageIndex,
      images: blog.images,
      prompt: input.prompt,
      src: input.src,
    });

    if (!target) {
      return NextResponse.json(
        { error: "Add an image description before refreshing." },
        { status: 400 },
      );
    }

    const previousImage =
      target.imageIndex !== null ? blog.images[target.imageIndex] : undefined;
    const previousUrl = previousImage?.url || input.src;
    const isFeatureImage =
      input.isFeatureImage || target.imageIndex === 0;

    if (hasBlogAiWorkerJob()) {
      const jobId = await createBlogAiJob({
        blogId,
        input: {
          convexAuthToken: token,
          input: {
            alt: target.alt,
            currentFeatureImageUrl: blog.featureImageUrl,
            imageIndex: target.imageIndex ?? undefined,
            isFeatureImage,
            mdx: blog.mdx,
            previousUrl,
            productId: input.productId,
            prompt: target.prompt,
            sectionHeading: previousImage?.sectionHeading,
            sectionIndex: previousImage?.sectionIndex,
          },
          type: "blog.regenerateImage",
          userId,
        },
        productId,
        token,
      });
      const job = await waitForBlogAiJob({
        jobId,
        maximumWaitMs: imageRegenerationJobWaitMs,
        token,
      });

      if (job?.status === "failed") {
        throw new Error(job.error || "Could not refresh that image.");
      }

      return NextResponse.json(
        {
          jobId,
          ...(job?.result && typeof job.result === "object" ? job.result : {}),
          status: job?.status || "queued",
        },
        { status: job?.status === "succeeded" ? 200 : 202 },
      );
    }

    const nextImage = await regenerateBlogImage({
      alt: target.alt,
      prompt: target.prompt,
      sectionHeading: previousImage?.sectionHeading,
      sectionIndex: previousImage?.sectionIndex,
      token,
      userId,
    });

    if (!nextImage) {
      return NextResponse.json(
        { error: "Could not refresh that image yet." },
        { status: 502 },
      );
    }

    const nextFeatureImageUrl = isFeatureImage
      ? nextImage.url
      : blog.featureImageUrl;
    const nextMdx = replaceImageUrlInMdx({
      mdx: blog.mdx,
      nextUrl: nextImage.url,
      previousUrl,
    });

    await fetchMutation(
      updateBlogImageMutation,
      {
        blogId,
        productId,
        imageIndex: target.imageIndex ?? undefined,
        image: nextImage,
        featureImageUrl: nextFeatureImageUrl,
        mdx: nextMdx,
      },
      { token },
    );

    return NextResponse.json({
      image: nextImage,
      featureImageUrl: nextFeatureImageUrl,
      mdx: nextMdx,
    });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
