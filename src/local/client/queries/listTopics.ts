import type { LocalState } from "../../domain/LocalState";
import { paginateLocal } from "./paginateLocal";
export const listTopics = (state: LocalState, args: Record<string, unknown>) => {
  const productId = String(args.productId || state.activeProductId || "");
  const status = args.status;
  const search = String(args.searchQuery || "").toLowerCase();
  const items = state.topics.filter((item) => item.productId === productId && (!status || (status === "scheduled" ? Boolean(item.scheduledDate) : status === "saved" ? item.status === "saved" && !item.scheduledDate : item.status === status)) && (!search || `${item.keyword} ${item.notes || ""}`.toLowerCase().includes(search)));
  return paginateLocal(items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).map((item) => ({ ...item, _id: item.id })), args);
};
