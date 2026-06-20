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
  role: v.optional(v.union(v.literal("feature"), v.literal("supporting"))),
  url: v.string(),
});

export const upsertGeneratedBlog = mutation({
  args: {
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
    const existing = args.topicId
      ? await ctx.db
          .query("blogs")
          .withIndex("by_topicId", (q) => q.eq("topicId", args.topicId))
          .first()
      : null;

    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });

      if (args.topicId) {
        await ctx.db.patch(args.topicId, {
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
        status: args.status === "failed" ? "failed" : "written",
        blogId,
        updatedAt: now,
      });
    }

    return blogId;
  },
});
