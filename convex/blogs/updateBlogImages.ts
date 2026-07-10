import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { imageValidator } from "../aiJobs/imageValidator";
import { requireUserId } from "../identity/requireUserId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";

export const updateBlogImages = mutation({
  args: {
    blogId: v.id("blogs"),
    featureImageUrl: v.optional(v.string()),
    images: v.array(imageValidator),
    mdx: v.string(),
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

    const updatedBlog = {
      ...blog,
      featureImageUrl: args.featureImageUrl,
      images: args.images,
      mdx: args.mdx,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.blogId, {
      featureImageUrl: updatedBlog.featureImageUrl,
      images: updatedBlog.images,
      mdx: updatedBlog.mdx,
      updatedAt: updatedBlog.updatedAt,
    });
    await upsertBlogReadModels(ctx, updatedBlog);
  },
});
