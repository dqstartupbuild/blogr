import type { LocalState } from "../../domain/LocalState";
export const listScheduledTopics = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  return state.topics.filter((item) => item.productId === productId && item.scheduledDate && item.scheduledDate >= String(args.startDate || "") && item.scheduledDate <= String(args.endDate || "")).map((item) => ({ ...item, _id: item.id }));
};
