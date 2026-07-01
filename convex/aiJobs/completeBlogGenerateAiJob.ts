import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { buildBlogSearchText } from "../blogs/buildBlogSearchText";
import { validateSeoContentLengths } from "../blogs/validateSeoContentLengths";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { findBlogSummaryByTopicId } from "../readModels/findBlogSummaryByTopicId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { assertAiWorkerSecret } from "./assertAiWorkerSecret";
import { imageValidator } from "./imageValidator";
import { linkValidator } from "./linkValidator";

export const completeBlogGenerateAiJob = mutation({
  args: {
    excerpt: v.string(),
    featureImageUrl: v.optional(v.string()),
    images: v.array(imageValidator),
    internalLinks: v.array(linkValidator),
    jobId: v.id("aiJobs"),
    keyword: v.string(),
    mdx: v.string(),
    productId: v.id("products"),
    secret: v.string(),
    seoTitle: v.string(),
    slug: v.string(),
    sources: v.array(linkValidator),
    status: v.union(v.literal("draft"), v.literal("ready"), v.literal("failed")),
    tags: v.optional(v.array(v.string())),
    title: v.string(),
    topicId: v.optional(v.id("topics")),
    youtubeVideos: v.array(linkValidator),
  },
  handler: async (ctx, args) => {
    assertAiWorkerSecret(args.secret);

    const now = Date.now();
    const job = await ctx.db.get(args.jobId);
    const seoTitle = args.seoTitle.trim();
    const excerpt = args.excerpt.trim();

    validateSeoContentLengths({ excerpt, seoTitle });

    if (!job || job.type !== "blog.generate") {
      throw new Error("AI job not found.");
    }

    await resolveActiveProductId(ctx, job.userId, args.productId);

    const linkedTopic = args.topicId ? await ctx.db.get(args.topicId) : null;
    if (args.topicId) {
      if (
        !linkedTopic ||
        linkedTopic.userId !== job.userId ||
        (linkedTopic.productId && linkedTopic.productId !== args.productId)
      ) {
        throw new Error("Topic not found in this workspace.");
      }
    }

    const existingSummary = args.topicId
      ? await findBlogSummaryByTopicId(ctx, args.topicId)
      : null;
    const existing = !existingSummary && args.topicId
      ? await ctx.db
          .query("blogs")
          .withIndex("by_topicId", (q) => q.eq("topicId", args.topicId))
          .first()
      : null;
    const blogPayload = {
      excerpt,
      featureImageUrl: args.featureImageUrl,
      images: args.images,
      internalLinks: args.internalLinks,
      keyword: args.keyword,
      mdx: args.mdx,
      productId: args.productId,
      searchText: buildBlogSearchText({
        excerpt,
        keyword: args.keyword,
        seoTitle,
        title: args.title,
      }),
      seoTitle,
      slug: args.slug,
      sources: args.sources,
      status: args.status,
      tags: args.tags,
      title: args.title,
      topicId: args.topicId,
      updatedAt: now,
      youtubeVideos: args.youtubeVideos,
    };
    const blogId =
      existingSummary &&
      existingSummary.userId === job.userId &&
      existingSummary.productId === args.productId
        ? existingSummary.blogId
        : existing &&
            existing.userId === job.userId &&
            (!existing.productId || existing.productId === args.productId)
          ? existing._id
        : await ctx.db.insert("blogs", {
            ...blogPayload,
            createdAt: now,
            userId: job.userId,
          });

    if (existingSummary && blogId === existingSummary.blogId) {
      await ctx.db.patch(existingSummary.blogId, blogPayload);
    } else if (existing && blogId === existing._id) {
      await ctx.db.patch(existing._id, blogPayload);
    }

    await upsertBlogReadModels(ctx, {
      ...(existingSummary
        ? {
            _id: existingSummary.blogId,
            createdAt: existingSummary.createdAt,
            userId: existingSummary.userId,
          }
        : existing || {
        _id: blogId,
        createdAt: now,
        userId: job.userId,
      }),
      ...blogPayload,
    });

    if (args.topicId && linkedTopic) {
      const topicStatus =
        args.status === "failed" ? ("failed" as const) : ("written" as const);
      const updatedTopic = {
        ...linkedTopic,
        blogId,
        lastError: undefined,
        productId: args.productId,
        status: topicStatus,
        updatedAt: now,
      };

      await ctx.db.patch(args.topicId, {
        blogId,
        lastError: undefined,
        productId: args.productId,
        status: topicStatus,
        updatedAt: now,
      });
      await upsertTopicReadModel(ctx, updatedTopic);
    }

    await ctx.db.patch(args.jobId, {
      completedAt: now,
      error: undefined,
      leaseExpiresAt: undefined,
      result: { blogId },
      status: "succeeded",
      updatedAt: now,
    });

    return blogId;
  },
});
