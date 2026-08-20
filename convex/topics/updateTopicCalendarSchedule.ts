import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { upsertTopicReadModel } from "../readModels/upsertTopicReadModel";
import { buildTopicSearchText } from "./buildTopicSearchText";

export const updateTopicCalendarSchedule = async (
  ctx: MutationCtx,
  topic: Doc<"topics">,
  scheduledDate: string | undefined,
  productId: Doc<"topics">["productId"],
  updatedAt: number,
) => {
  const status =
    scheduledDate && topic.status === "saved"
      ? "scheduled"
      : !scheduledDate && topic.status === "scheduled"
        ? "saved"
        : topic.status;
  const searchText = buildTopicSearchText({
    canonicalKeyword: topic.canonicalKeyword,
    intentKey: topic.intentKey,
    keyword: topic.keyword,
    notes: topic.notes,
    scheduledDate,
    sourceType: topic.sourceType,
  });
  const updatedTopic = {
    ...topic,
    productId,
    scheduledDate,
    searchText,
    status,
    updatedAt,
  };

  await ctx.db.patch(topic._id, {
    productId,
    scheduledDate,
    searchText,
    status,
    updatedAt,
  });
  await upsertTopicReadModel(ctx, updatedTopic);
};
