import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { resolveBlogPublishedAt } from "./resolveBlogPublishedAt";

export const markBlogPublished = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      throw new Error("Blog not found.");
    }

    if (args.productId && blog.productId && blog.productId !== args.productId) {
      throw new Error("Blog not found in this workspace.");
    }

    const now = Date.now();
    const updatedBlog = {
      ...blog,
      productId: blog.productId || args.productId,
      publishedAt: resolveBlogPublishedAt("published", blog.publishedAt, now),
      status: "published",
      updatedAt: now,
    } as const;

    await ctx.db.patch(args.blogId, {
      productId: updatedBlog.productId,
      publishedAt: updatedBlog.publishedAt,
      status: updatedBlog.status,
      updatedAt: updatedBlog.updatedAt,
    });
    await upsertBlogReadModels(ctx, updatedBlog);

    if (!blog.topicId) {
      return;
    }

    const topic = await ctx.db.get(blog.topicId);

    if (
      !topic ||
      topic.userId !== userId ||
      (updatedBlog.productId &&
        topic.productId &&
        topic.productId !== updatedBlog.productId)
    ) {
      return;
    }

    const updatedTopic = {
      ...topic,
      blogId: blog._id,
      productId: topic.productId || updatedBlog.productId,
      status: "published",
      updatedAt: now,
    } as const;

    await ctx.db.patch(topic._id, {
      blogId: updatedTopic.blogId,
      productId: updatedTopic.productId,
      status: updatedTopic.status,
      updatedAt: updatedTopic.updatedAt,
    });
    await upsertTopicReadModel(ctx, updatedTopic);
  },
});
