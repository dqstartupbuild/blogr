import type { TopicReadModelSource } from "./TopicReadModelSource";

export const buildTopicKeywordOption = (topic: TopicReadModelSource) => {
  if (!topic.productId) {
    return null;
  }

  return {
    blogId: topic.blogId,
    canonicalKeyword: topic.canonicalKeyword,
    createdAt: topic.createdAt,
    intentKey: topic.intentKey,
    isScheduled: Boolean(topic.scheduledDate || topic.status === "scheduled"),
    keyword: topic.keyword,
    notes: topic.notes,
    productId: topic.productId,
    searchText: topic.searchText,
    scheduledDate: topic.scheduledDate,
    sourceType: topic.sourceType,
    status: topic.status,
    topicId: topic._id,
    updatedAt: topic.updatedAt,
    userId: topic.userId,
  };
};
