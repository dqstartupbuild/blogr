import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";

const linkValidator = v.object({
  title: v.string(),
  url: v.string(),
  reason: v.optional(v.string()),
});

const imageValidator = v.object({
  alt: v.string(),
  prompt: v.string(),
  url: v.string(),
});

export const upsertGeneratedBlog = mutation({
  args: {
    productId: v.id("products"),
    topicId: v.optional(v.id("topics")),
    keyword: v.string(),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    mdx: v.string(),
    featureImageUrl: v.optional(v.string()),
    images: v.array(imageValidator),
    internalLinks: v.array(linkValidator),
    youtubeVideos: v.array(linkValidator),
    sources: v.array(linkValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const product = await ctx.db.get(args.productId);

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
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });

      if (args.topicId) {
        await ctx.db.patch(args.topicId, {
          productId: args.productId,
          status: args.status === "failed" ? "failed" : "written",
          blogId: existing._id,
          updatedAt: now,
        });
      }

      return existing._id;
    }

    const blogId = await ctx.db.insert("blogs", {
      ...args,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    if (args.topicId) {
      await ctx.db.patch(args.topicId, {
        productId: args.productId,
        status: args.status === "failed" ? "failed" : "written",
        blogId,
        updatedAt: now,
      });
    }

    return blogId;
  },
});
