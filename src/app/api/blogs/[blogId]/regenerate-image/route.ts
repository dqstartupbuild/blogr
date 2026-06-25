import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { regenerateBlogImage } from "@/server/blog/regenerateBlogImage";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { updateBlogImageMutation } from "@/server/convex/references/updateBlogImageMutation";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { regenerateImageRequestSchema } from "./schema";

type RegenerateImageRouteContext = {
  params: Promise<{ blogId: string }>;
};

export const maxDuration = 120;

export async function POST(request: Request, context: RegenerateImageRouteContext) {
  try {
    const userId = await requireRouteUserId();

    if (!hasConvexUrl()) {
      throw new Error("Connect Convex before refreshing images.");
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

    if (input.imageIndex >= blog.images.length) {
      return NextResponse.json(
        { error: "Image not found." },
        { status: 404 },
      );
    }

    const nextImage = await regenerateBlogImage({
      alt: input.alt,
      prompt: input.prompt,
      token,
      userId,
    });

    if (!nextImage) {
      return NextResponse.json(
        { error: "Could not refresh that image yet." },
        { status: 502 },
      );
    }

    const previousImage = blog.images[input.imageIndex];
    const nextFeatureImageUrl =
      input.isFeatureImage || input.imageIndex === 0
        ? nextImage.url
        : blog.featureImageUrl;
    const nextMdx = previousImage?.url
      ? blog.mdx.split(previousImage.url).join(nextImage.url)
      : blog.mdx;

    await fetchMutation(
      updateBlogImageMutation,
      {
        blogId,
        productId,
        imageIndex: input.imageIndex,
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
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}