import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { validateSeoContentLengths } from "../blogs/validateSeoContentLengths";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";
import { imageValidator } from "./imageValidator";

export const completeImageRegenerationAiJob = mutation({
  args: {
    featureImageUrl: v.optional(v.string()),
    image: imageValidator,
    imageIndex: v.optional(v.number()),
    jobId: v.id("aiJobs"),
    mdx: v.string(),
    productId: v.optional(v.id("products")),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);

    if (!job || job.type !== "blog.regenerateImage" || !job.blogId) {
      throw new Error("AI job not found.");
    }

    const blog = await ctx.db.get(job.blogId);

    if (
      !blog ||
      blog.userId !== job.userId ||
      (args.productId && blog.productId && blog.productId !== args.productId)
    ) {
      throw new Error("Blog not found in this workspace.");
    }

    validateSeoContentLengths({
      excerpt: blog.excerpt,
      seoTitle: blog.seoTitle || blog.title,
    });

    const images = [...blog.images];

    if (
      typeof args.imageIndex === "number" &&
      args.imageIndex >= 0 &&
      args.imageIndex < images.length
    ) {
      images[args.imageIndex] = args.image;
    } else {
      images.push(args.image);
    }

    const updatedBlog = {
      ...blog,
      featureImageUrl: args.featureImageUrl,
      images,
      mdx: args.mdx,
      updatedAt: now,
    };

    await ctx.db.patch(job.blogId, {
      featureImageUrl: args.featureImageUrl,
      images,
      mdx: args.mdx,
      updatedAt: now,
    });
    await upsertBlogReadModels(ctx, updatedBlog);

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: {
        featureImageUrl: args.featureImageUrl,
        image: args.image,
        mdx: args.mdx,
      },
      status: "succeeded",
      updatedAt: now,
    });
  },
});
