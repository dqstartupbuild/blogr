import { extractJsonObject } from "./extractJsonObject";
import { topicDiscoveryResultSchema } from "./topicDiscoveryResultSchema";

export const parseTopicDiscoveryJson = (text: string) => {
  return topicDiscoveryResultSchema.parse(JSON.parse(extractJsonObject(text)));
};
