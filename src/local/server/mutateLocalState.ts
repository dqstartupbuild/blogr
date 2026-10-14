import type { LocalState } from "../domain/LocalState";
import { mutateProduct } from "./mutateProduct";
import { mutateTopic } from "./mutateTopic";
import { mutateBlog } from "./mutateBlog";

const productChanges = new Set([
  "createProductWorkspaceMutation", "setActiveProductWorkspaceMutation", "deleteProductWorkspaceMutation",
  "saveProductScanMutation",
  "updateProductDetailsMutation", "updateProductSiteLinksMutation", "updateBlogGenerationSettingsMutation",
  "updateCalendarQueueSettingsMutation", "updateBlogPublishingIntegrationMutation",
]);
const topicChanges = new Set([
  "createTopicMutation", "createScheduledTopicMutation", "createScheduledTopicBatchMutation",
  "createTopicBatchMutation", "quickFillExistingTopicsMutation", "deleteTopicMutation",
  "updateTopicNotesMutation", "updateTopicScheduledDateMutation", "updateTopicStatusMutation",
]);
const blogChanges = new Set([
  "upsertGeneratedBlogMutation", "deleteBlogMutation", "updateBlogContentMutation",
  "updateBlogImagesMutation", "updateBlogImageMutation", "markBlogPublishedMutation",
]);
export const mutateLocalState = (state: LocalState, name: string, args: Record<string, unknown>): unknown => {
  if (productChanges.has(name)) return mutateProduct(state, name, args);
  if (topicChanges.has(name)) return mutateTopic(state, name, args);
  if (blogChanges.has(name)) return mutateBlog(state, name, args);
  throw new Error(`Unknown local change: ${name}`);
};
