import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildBlogSearchText } from "./buildBlogSearchText";
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
    const product = await ctx.db.get(args.productId);
    const seoTitle = args.seoTitle.trim();
    const excerpt = args.excerpt.trim();

    validateSeoContentLengths({ excerpt, seoTitle });

    if (!product || product.userId !== userId) {
      throw new Error("Workspace not found.");
    }

    if (args.topicId) {
      const topic = await ctx.db.get(args.topicId);

      if (
        !topic ||
        topic.userId !== userId ||
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

    if (
      existing &&
      existing.userId === userId &&
      (!existing.productId || existing.productId === args.productId)
    ) {
      const updatedBlog = {
        ...existing,
        ...args,
        excerpt,
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
        searchText: updatedBlog.searchText,
        seoTitle,
        updatedAt: now,
      });
      await upsertBlogReadModels(ctx, updatedBlog);

      if (args.topicId) {
        const topic = await ctx.db.get(args.topicId);
        const topicStatus =
          args.status === "failed" ? ("failed" as const) : ("written" as const);
        const updatedTopic = topic
          ? {
              ...topic,
              productId: args.productId,
              status: topicStatus,
              blogId: existing._id,
              updatedAt: now,
            }
          : null;

        await ctx.db.patch(args.topicId, {
          productId: args.productId,
          status: topicStatus,
          blogId: existing._id,
          updatedAt: now,
        });

        if (updatedTopic) {
          await upsertTopicReadModel(ctx, updatedTopic);
        }
      }

      return existing._id;
    }

    const blog = {
      ...args,
      excerpt,
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

    if (args.topicId) {
      const topic = await ctx.db.get(args.topicId);
      const topicStatus =
        args.status === "failed" ? ("failed" as const) : ("written" as const);
      const updatedTopic = topic
        ? {
            ...topic,
            productId: args.productId,
            status: topicStatus,
            blogId,
            updatedAt: now,
          }
        : null;

      await ctx.db.patch(args.topicId, {
        productId: args.productId,
        status: topicStatus,
        blogId,
        updatedAt: now,
      });

      if (updatedTopic) {
        await upsertTopicReadModel(ctx, updatedTopic);
      }
    }

    return blogId;
  },
});
