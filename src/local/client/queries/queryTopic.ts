import type { LocalState } from "../../domain/LocalState";
export const queryTopic = (state: LocalState, _name: string, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  return state.topics.find((item) => item.id === args.topicId && item.productId === productId) || null;
};
