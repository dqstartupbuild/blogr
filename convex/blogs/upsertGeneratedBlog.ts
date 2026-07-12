import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { resolveActiveProductId } from "../products/resolveActiveProductId";
import { findBlogSummaryByTopicId } from "../readModels/findBlogSummaryByTopicId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildBlogSearchText } from "./buildBlogSearchText";
import { resolveBlogPublishedAt } from "./resolveBlogPublishedAt";
import { validateSeoContentLengths } from "./validateSeoContentLengths";

const linkValidator = v.object({
  isActive: v.optional(v.boolean()),
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

const imageValidator = v.object({
  alt: v.string(),
  prompt: v.string(),
  r2Key: v.optional(v.string()),
  sectionHeading: v.optional(v.string()),
  url: v.string(),
});

export const upsertGeneratedBlog = mutation({
  args: {
    productId: v.id("products"),
    topicId: v.optional(v.id("topics")),
    keyword: v.string(),
    title: v.string(),
    seoTitle: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("published"),
    ),
    mdx: v.string(),
    featureImageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    images: v.array(imageValidator),
    internalLinks: v.array(linkValidator),
    youtubeVideos: v.array(linkValidator),
    sources: v.array(linkValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const seoTitle = args.seoTitle.trim();
    const excerpt = args.excerpt.trim();

    validateSeoContentLengths({ excerpt, seoTitle });
    await resolveActiveProductId(ctx, userId, args.productId);

    const linkedTopic = args.topicId ? await ctx.db.get(args.topicId) : null;
    if (args.topicId) {
      if (
        !linkedTopic ||
        linkedTopic.userId !== userId ||
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

    if (
      existingSummary &&
      existingSummary.userId === userId &&
      existingSummary.productId === args.productId
    ) {
      const searchText = buildBlogSearchText({
        excerpt,
        keyword: args.keyword,
        seoTitle,
        title: args.title,
      });
      const updatedBlog = {
        _id: existingSummary.blogId,
        ...args,
        excerpt,
        publishedAt: resolveBlogPublishedAt(
          args.status,
          existingSummary.publishedAt,
          now,
        ),
        searchText,
        seoTitle,
        userId,
        createdAt: existingSummary.createdAt,
        updatedAt: now,
      };

      await ctx.db.patch(existingSummary.blogId, {
        ...args,
        excerpt,
        publishedAt: updatedBlog.publishedAt,
        searchText,
        seoTitle,
        updatedAt: now,
      });
      await upsertBlogReadModels(ctx, updatedBlog);

      if (args.topicId && linkedTopic) {
        const topicStatus =
          args.status === "failed"
            ? ("failed" as const)
            : args.status === "published"
              ? ("published" as const)
              : ("written" as const);
        const updatedTopic = {
          ...linkedTopic,
          productId: args.productId,
          status: topicStatus,
          blogId: existingSummary.blogId,
          updatedAt: now,
        };

        await ctx.db.patch(args.topicId, {
          productId: args.productId,
          status: topicStatus,
          blogId: existingSummary.blogId,
          updatedAt: now,
        });
        await upsertTopicReadModel(ctx, updatedTopic);
      }

      return existingSummary.blogId;
    }

    if (
      existing &&
      existing.userId === userId &&
      (!existing.productId || existing.productId === args.productId)
    ) {
      const updatedBlog = {
        ...existing,
        ...args,
        excerpt,
        publishedAt: resolveBlogPublishedAt(
          args.status,
          existing.publishedAt,
          now,
        ),
        searchText: buildBlogSearchText({
          excerpt,
          keyword: args.keyword,
          seoTitle,
          title: args.title,
        }),
        seoTitle,
        updatedAt: now,
      };

      await ctx.db.patch(existing._id, {
        ...args,
        excerpt,
        publishedAt: updatedBlog.publishedAt,
        searchText: updatedBlog.searchText,
        seoTitle,
        updatedAt: now,
      });
      await upsertBlogReadModels(ctx, updatedBlog);

      if (args.topicId && linkedTopic) {
        const topicStatus =
          args.status === "failed"
            ? ("failed" as const)
            : args.status === "published"
              ? ("published" as const)
              : ("written" as const);
        const updatedTopic = {
          ...linkedTopic,
          productId: args.productId,
          status: topicStatus,
          blogId: existing._id,
          updatedAt: now,
        };

        await ctx.db.patch(args.topicId, {
          productId: args.productId,
          status: topicStatus,
          blogId: existing._id,
          updatedAt: now,
        });
        await upsertTopicReadModel(ctx, updatedTopic);
      }

      return existing._id;
    }

    const blog = {
      ...args,
      excerpt,
      publishedAt: resolveBlogPublishedAt(args.status, undefined, now),
      searchText: buildBlogSearchText({
        excerpt,
        keyword: args.keyword,
        seoTitle,
        title: args.title,
      }),
      seoTitle,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const blogId = await ctx.db.insert("blogs", blog);

    await upsertBlogReadModels(ctx, {
      ...blog,
      _id: blogId,
    });

    if (args.topicId && linkedTopic) {
      const topicStatus =
        args.status === "failed"
          ? ("failed" as const)
          : args.status === "published"
            ? ("published" as const)
            : ("written" as const);
      const updatedTopic = {
        ...linkedTopic,
        productId: args.productId,
        status: topicStatus,
        blogId,
        updatedAt: now,
      };

      await ctx.db.patch(args.topicId, {
        productId: args.productId,
        status: topicStatus,
        blogId,
        updatedAt: now,
      });
      await upsertTopicReadModel(ctx, updatedTopic);
    }

    return blogId;
  },
});
