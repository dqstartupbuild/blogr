import { normalizeTopicIntentToken } from "./normalizeTopicIntentToken";
import { topicIntentStopWords } from "./topicIntentStopWords";

export const tokenizeTopicIntent = (keyword: string) => {
  return keyword
    .split(/[^a-zA-Z0-9]+/)
    .map(normalizeTopicIntentToken)
    .filter((token) => token.length > 1 && !topicIntentStopWords.has(token));
};
