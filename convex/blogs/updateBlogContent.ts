import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertBlogReadModels } from "../readModels/upsertBlogReadModels";
import { buildBlogSearchText } from "./buildBlogSearchText";
import { validateSeoContentLengths } from "./validateSeoContentLengths";

export const updateBlogContent = mutation({
  args: {
    blogId: v.id("blogs"),
    productId: v.optional(v.id("products")),
    title: v.string(),
    seoTitle: v.string(),
    excerpt: v.string(),
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

    const seoTitle = args.seoTitle.trim();
    const excerpt = args.excerpt.trim();

    validateSeoContentLengths({ excerpt, seoTitle });

    const updatedBlog = {
      ...blog,
      productId: blog.productId || args.productId,
      title: args.title.trim(),
      seoTitle,
      excerpt,
      searchText: buildBlogSearchText({
        excerpt,
        keyword: blog.keyword,
        seoTitle,
        title: args.title,
      }),
      mdx: args.mdx,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.blogId, {
      productId: updatedBlog.productId,
      title: updatedBlog.title,
      seoTitle,
      excerpt,
      searchText: updatedBlog.searchText,
      mdx: args.mdx,
      updatedAt: updatedBlog.updatedAt,
    });
    await upsertBlogReadModels(ctx, updatedBlog);
  },
});
