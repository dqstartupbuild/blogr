import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireUserId } from "../identity/requireUserId";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicSearchText } from "./buildTopicSearchText";

export const updateTopicNotes = mutation({
  args: {
    notes: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const topic = await ctx.db.get(args.topicId);
    const notes = args.notes?.trim();

    if (!topic || topic.userId !== userId) {
      throw new Error("Topic not found.");
    }

    if (
      args.productId &&
      topic.productId &&
      topic.productId !== args.productId
    ) {
      throw new Error("Topic not found in this workspace.");
    }

    if (topic.blogId || topic.status === "written") {
      throw new Error(
        "This brief is locked because its article is already written.",
      );
    }

    const searchText = buildTopicSearchText({
      canonicalKeyword: topic.canonicalKeyword,
      intentKey: topic.intentKey,
      keyword: topic.keyword,
      notes,
      scheduledDate: topic.scheduledDate,
      sourceType: topic.sourceType,
    });
    const updatedTopic = {
      ...topic,
      notes: notes || undefined,
      productId: topic.productId || args.productId,
      searchText,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.topicId, {
      searchText,
      notes: updatedTopic.notes,
      productId: updatedTopic.productId,
      updatedAt: updatedTopic.updatedAt,
    });
    await upsertTopicReadModel(ctx, updatedTopic);
  },
});
