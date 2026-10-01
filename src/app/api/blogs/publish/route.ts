import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { readLocalJson } from "@/local/server/readLocalJson";
import { readLocalState } from "@/local/server/readLocalState";
import { updateLocalState } from "@/local/server/updateLocalState";
import { mutateBlog } from "@/local/server/mutateBlog";
import { localErrorResponse } from "@/local/server/localErrorResponse";
import { buildBlogPublishPayload } from "@/server/publishing/buildBlogPublishPayload";
import { getBlogPublishEventType } from "@/server/publishing/getBlogPublishEventType";
import { getBlogPublishEnvironmentDestination } from "@/server/publishing/getBlogPublishEnvironmentDestination";
import { getBlogPublishToken } from "@/server/publishing/getBlogPublishToken";
import { sendBlogPublishWebhook } from "@/server/publishing/sendBlogPublishWebhook";
import { blogPublishRequestSchema } from "./schema";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    assertLocalRequest(request);
    const input = blogPublishRequestSchema.parse(await readLocalJson(request));
    const state = await readLocalState();
    const blog = state.blogs.find((item) => item.id === input.blog.id && item.productId === input.blog.productId);
    if (!blog) throw new Error("Article not found.");
    const product = state.products.find((item) => item.id === blog.productId);
    const configured = getBlogPublishEnvironmentDestination();
    const destination = product?.blogPublishingIntegration?.enabled
      ? product.blogPublishingIntegration.webhookUrl && getBlogPublishToken(product.id)
        ? { token: getBlogPublishToken(product.id), url: product.blogPublishingIntegration.webhookUrl, sourceName: product.blogPublishingIntegration.sourceName || "Blogr" }
        : null
      : configured;
    if (!destination) throw new Error("Set BLOG_PUBLISH_WEBHOOK_URL and BLOG_PUBLISH_WEBHOOK_TOKEN before publishing.");
    if (blog.images.some((image) => image.url.startsWith("/api/local/")) || blog.featureImageUrl?.startsWith("/api/local/") || blog.mdx.includes("/api/local/media/")) throw new Error("This article has images saved only on this computer. Export it or use a publishing receiver that accepts uploaded images.");
    const message = await sendBlogPublishWebhook(buildBlogPublishPayload(blog, getBlogPublishEventType(blog), destination.sourceName), destination);
    try {
      const latest = await readLocalState();
      await updateLocalState(latest.revision, (next) => {
        const current = next.blogs.find((item) => item.id === blog.id && item.productId === blog.productId);
        if (!current || current.updatedAt !== blog.updatedAt) throw new Error("The article changed during publishing.");
        return mutateBlog(next, "markBlogPublishedMutation", { blogId: blog.id, productId: blog.productId });
      });
      return NextResponse.json({ published: true, message: message || "Published." }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({ published: true, message: "The receiving site accepted this article, but its local status could not be saved because the article changed or storage failed. Reload and check before publishing again." }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch (error) { return localErrorResponse(error); }
}
