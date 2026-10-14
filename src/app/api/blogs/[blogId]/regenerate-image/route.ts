import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateBlog } from "@/local/server/mutateBlog";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { regenerateBlogImage } from "@/server/blog/regenerateBlogImage";
import { replaceImageUrlInMdx } from "@/server/blog/replaceImageUrlInMdx";
import { resolveRegenerateImageTarget } from "@/server/blog/resolveRegenerateImageTarget";
import { regenerateImageRequestSchema } from "./schema";
import { withManagedMediaScope } from "@/local/server/withManagedMediaScope";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request, { params }: { params: Promise<{ blogId: string }> }) {
  try { return await withManagedMediaScope(async () => {
    assertLocalRequest(request);
    const input = regenerateImageRequestSchema.parse(await readLocalJson(request));
    const { blogId } = await params;
    const state = await readLocalState();
    const blog = state.blogs.find((item) => item.id === blogId && item.productId === input.productId);
    if (!blog) throw new Error("Article not found.");
    const target = resolveRegenerateImageTarget({ alt: input.alt, imageIndex: input.imageIndex, images: blog.images, prompt: input.prompt, src: input.src });
    if (!target) throw new Error("Add an image description before refreshing.");
    const previous = target.imageIndex === null ? undefined : blog.images[target.imageIndex];
    const image = await regenerateBlogImage({ alt: target.alt, prompt: target.prompt, sectionHeading: previous?.sectionHeading, sectionIndex: previous?.sectionIndex });
    if (!image) throw new Error("Could not refresh that image yet.");
    const featureImageUrl = input.isFeatureImage || target.imageIndex === 0 ? image.url : blog.featureImageUrl;
    const mdx = replaceImageUrlInMdx({ mdx: blog.mdx, nextUrl: image.url, previousUrl: previous?.url || input.src });
    const latest = await readLocalState();
    await updateLocalState(latest.revision, (next) => {
      const current = next.blogs.find((item) => item.id === blogId && item.productId === blog.productId);
      if (!current || current.updatedAt !== blog.updatedAt) throw new Error("This article changed while the image was being made. Reload before trying again.");
      return mutateBlog(next, "updateBlogImageMutation", { blogId, productId: blog.productId, imageIndex: target.imageIndex, image, featureImageUrl, mdx });
    });
    return NextResponse.json({ image, featureImageUrl, mdx }, { headers: { "Cache-Control": "no-store" } });
  });
  } catch (error) { return localErrorResponse(error); }
}
