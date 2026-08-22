import { discoverTopicIdeasForProduct } from "../topics/discoverTopicIdeasForProduct";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type TopicDiscoverWorkerJob = Extract<
  BlogAiWorkerJob,
  { type: "topic.discover" }
>;

export const runTopicDiscoverWorkerJob = async ({
  input,
}: TopicDiscoverWorkerJob) => {
  const discovery = await discoverTopicIdeasForProduct({
    existingBlogs: input.existingBlogs,
    existingTopics: input.existingTopics.map((topic) => topic.keyword),
    includeAiAnswers: input.includeAiAnswers,
    product: input.product,
    seedKeyword: input.seedKeyword,
  });

  return { discovery };
};
