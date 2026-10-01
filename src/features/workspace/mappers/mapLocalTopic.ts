import type { TopicItem } from "../types/TopicItem";
import { getScheduledAwareTopicStatus } from "../utils/getScheduledAwareTopicStatus";

type LocalTopicLike = {
  _id?: string;
  blogId?: string;
  canonicalKeyword?: string;
  createdAt?: number;
  intentKey?: string;
  keyword?: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?: TopicItem["sourceType"];
  status?: TopicItem["status"];
  updatedAt?: number;
};

export const mapLocalTopic = (topic: LocalTopicLike): TopicItem => {
  return {
    blogId: topic.blogId,
    canonicalKeyword: topic.canonicalKeyword,
    createdAt: topic.createdAt,
    id: topic._id || "",
    intentKey: topic.intentKey,
    keyword: topic.keyword || "",
    notes: topic.notes,
    scheduledDate: topic.scheduledDate,
    sourceType: topic.sourceType,
    status: getScheduledAwareTopicStatus({
      scheduledDate: topic.scheduledDate,
      status: topic.status,
    }),
    updatedAt: topic.updatedAt,
  };
};
