import type { LocalState } from "../../domain/LocalState";
import { buildTopicIntentKey } from "@/server/topics/buildTopicIntentKey";

// Keywords and intent keys already used by a workspace's topics or articles.
export const collectTakenTopicKeys = (state: LocalState, productId: string) =>
  new Set([
    ...state.topics.filter((item) => item.productId === productId).flatMap((item) => [item.keyword.toLowerCase(), item.canonicalKeyword?.toLowerCase(), item.intentKey || buildTopicIntentKey(item.keyword)]),
    ...state.blogs.filter((item) => item.productId === productId).flatMap((item) => [item.keyword.toLowerCase(), buildTopicIntentKey(item.keyword)]),
  ]);
