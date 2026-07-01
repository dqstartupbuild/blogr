import { buildTopicBriefNotesForKeyword } from "../topics/buildTopicBriefNotesForKeyword";
import { discoverTopicIdeasForProduct } from "../topics/discoverTopicIdeasForProduct";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type TopicBriefWorkerJob = Extract<BlogAiWorkerJob, { type: "topic.brief" }>;

export const runTopicBriefWorkerJob = async ({ input }: TopicBriefWorkerJob) => {
  const discovery = await discoverTopicIdeasForProduct({
    existingBlogs: input.existingBlogs,
    existingTopics: input.existingTopics.map((topic) => topic.keyword),
    includeAiAnswers: input.includeAiAnswers,
    product: input.product,
    seedKeyword: input.seedKeyword,
  });
  const notes = buildTopicBriefNotesForKeyword({
    discovery,
    keyword: input.topicKeyword,
  });

  return { discovery, notes };
};
