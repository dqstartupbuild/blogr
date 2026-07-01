import type { TopicItem } from "../types/TopicItem";

type ConvexTopicLike = {
  _id?: string;
  blogId?: string;
  canonicalKeyword?: string;
  intentKey?: string;
  keyword?: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?: TopicItem["sourceType"];
  status?: TopicItem["status"];
};

export const mapConvexTopic = (topic: ConvexTopicLike): TopicItem => {
  return {
    blogId: topic.blogId,
    canonicalKeyword: topic.canonicalKeyword,
    id: topic._id || "",
    intentKey: topic.intentKey,
    keyword: topic.keyword || "",
    notes: topic.notes,
    scheduledDate: topic.scheduledDate,
    sourceType: topic.sourceType,
    status: topic.status || "saved",
  };
};
