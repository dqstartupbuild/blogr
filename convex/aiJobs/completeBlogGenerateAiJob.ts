import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { buildBlogSearchText } from "../blogs/buildBlogSearchText";
import { validateSeoContentLengths } from "../blogs/validateSeoContentLengths";
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
    const product = await ctx.db.get(args.productId);
    const seoTitle = args.seoTitle.trim();
    const excerpt = args.excerpt.trim();

    validateSeoContentLengths({ excerpt, seoTitle });

    if (!job || job.type !== "blog.generate") {
      throw new Error("AI job not found.");
    }

    if (!product || product.userId !== job.userId) {
      throw new Error("Workspace not found.");
    }

    if (args.topicId) {
      const topic = await ctx.db.get(args.topicId);

      if (
        !topic ||
        topic.userId !== job.userId ||
        (topic.productId && topic.productId !== args.productId)
      ) {
        throw new Error("Topic not found in this workspace.");
      }
    }

    const existing = args.topicId
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
      existing &&
      existing.userId === job.userId &&
      (!existing.productId || existing.productId === args.productId)
        ? existing._id
        : await ctx.db.insert("blogs", {
            ...blogPayload,
            createdAt: now,
            userId: job.userId,
          });

    if (existing && blogId === existing._id) {
      await ctx.db.patch(existing._id, blogPayload);
    }

    if (args.topicId) {
      await ctx.db.patch(args.topicId, {
        blogId,
        lastError: undefined,
        productId: args.productId,
        status: args.status === "failed" ? "failed" : "written",
        updatedAt: now,
      });
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
