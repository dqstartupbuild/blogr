import type { TopicItem } from "../types/TopicItem";

type ConvexTopicLike = {
  _id?: string;
  blogId?: string;
  keyword?: string;
  notes?: string;
  status?: TopicItem["status"];
};

export const mapConvexTopic = (topic: ConvexTopicLike): TopicItem => {
  return {
    blogId: topic.blogId,
    id: topic._id || "",
    keyword: topic.keyword || "",
    notes: topic.notes,
    status: topic.status || "saved",
  };
};
