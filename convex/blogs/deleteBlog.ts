import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { deleteBlogVersions } from "../blogVersions/deleteBlogVersions";
import { requireUserId } from "../identity/requireUserId";
import { deleteBlogReadModels } from "../readModels/deleteBlogReadModels";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";

export const deleteBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || blog.userId !== userId) {
      throw new Error("Article not found.");
    }

    if (args.productId && blog.productId && blog.productId !== args.productId) {
      throw new Error("Article not found in this workspace.");
    }

    if (blog.topicId) {
      const topic = await ctx.db.get(blog.topicId);

      if (topic?.userId === userId && topic.blogId === args.blogId) {
        const updatedTopic = {
          ...topic,
          blogId: undefined,
          status: topic.scheduledDate ? "scheduled" : "saved",
          updatedAt: Date.now(),
        } as const;

        await ctx.db.patch(blog.topicId, {
          blogId: undefined,
          status: updatedTopic.status,
          updatedAt: updatedTopic.updatedAt,
        });
        await upsertTopicReadModel(ctx, updatedTopic);
      }
    }

    await deleteBlogReadModels(ctx, blog);
    await deleteBlogVersions(ctx, args.blogId);
    await ctx.db.delete(args.blogId);
  },
});
