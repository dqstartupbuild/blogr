import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";

const imageValidator = v.object({
  alt: v.string(),
  prompt: v.string(),
  r2Key: v.optional(v.string()),
  sectionHeading: v.optional(v.string()),
  url: v.string(),
});

export const updateBlogImage = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
    imageIndex: v.optional(v.number()),
    image: imageValidator,
    featureImageUrl: v.optional(v.string()),
    mdx: v.string(),
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

    const shouldReplace =
      typeof args.imageIndex === "number" &&
      args.imageIndex >= 0 &&
      args.imageIndex < blog.images.length;
    const nextImages = shouldReplace
      ? blog.images.map((image, index) =>
          index === args.imageIndex ? args.image : image,
        )
      : [...blog.images, args.image];
    const updatedBlog = {
      ...blog,
      images: nextImages,
      featureImageUrl: args.featureImageUrl ?? blog.featureImageUrl,
      mdx: args.mdx,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.blogId, {
      images: nextImages,
      featureImageUrl: updatedBlog.featureImageUrl,
      mdx: args.mdx,
      updatedAt: updatedBlog.updatedAt,
    });
    await upsertBlogReadModels(ctx, updatedBlog);
  },
});
