import type { LocalState, LocalProduct } from "../../domain/LocalState";
import { getEditableProduct } from "./getEditableProduct";
export const updateCalendarQueueSettings = (state: LocalState, args: Record<string, unknown>) => {
  const product = getEditableProduct(state, args);
  if (args.expectedProductUpdatedAt !== product.updatedAt) throw new Error("The calendar queue changed on another tab. Reload before saving your edits.");
  product.calendarQueueSettings = args.settings as LocalProduct["calendarQueueSettings"];
  product.updatedAt = Math.max(Date.now(), product.updatedAt + 1);
  return product.id;
};
