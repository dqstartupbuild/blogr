import type { LocalState } from "../../domain/LocalState";
export const listTopicKeywords = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  return state.topics.filter((item) => item.productId === productId).map((item) => ({ ...item }));
};
