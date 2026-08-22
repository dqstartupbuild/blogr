import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";
import { waitForAiJobResult } from "./waitForAiJobResult";

type TopicDiscoveryJobResult = {
  discovery?: TopicDiscoveryResult;
};

export const waitForTopicDiscoveryJob = async (jobId: string) => {
  const result = await waitForAiJobResult<TopicDiscoveryJobResult>({ jobId });

  if (!result.discovery) {
    throw new Error("No topic ideas were returned.");
  }

  return result.discovery;
};
