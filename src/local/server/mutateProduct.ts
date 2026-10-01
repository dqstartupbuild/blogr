import type { LocalState } from "../domain/LocalState";
import { createProductWorkspace } from "./actions/createProductWorkspace";
import { deleteProductWorkspace } from "./actions/deleteProductWorkspace";
import { saveProductScan } from "./actions/saveProductScan";
import { setActiveProductWorkspace } from "./actions/setActiveProductWorkspace";
import { updateBlogGenerationSettings } from "./actions/updateBlogGenerationSettings";
import { updateBlogPublishingIntegration } from "./actions/updateBlogPublishingIntegration";
import { updateCalendarQueueSettings } from "./actions/updateCalendarQueueSettings";
import { updateProductDetails } from "./actions/updateProductDetails";
import { updateProductSiteLinks } from "./actions/updateProductSiteLinks";

const handlers = {
  createProductWorkspaceMutation: createProductWorkspace,
  deleteProductWorkspaceMutation: deleteProductWorkspace,
  saveProductScanMutation: saveProductScan,
  setActiveProductWorkspaceMutation: setActiveProductWorkspace,
  updateBlogGenerationSettingsMutation: updateBlogGenerationSettings,
  updateBlogPublishingIntegrationMutation: updateBlogPublishingIntegration,
  updateCalendarQueueSettingsMutation: updateCalendarQueueSettings,
  updateProductDetailsMutation: updateProductDetails,
  updateProductSiteLinksMutation: updateProductSiteLinks,
};

export const mutateProduct = (state: LocalState, name: string, args: Record<string, unknown>): unknown => {
  const handler = handlers[name as keyof typeof handlers];
  if (!handler) throw new Error(`Unknown product change: ${name}`);
  return handler(state, args);
};
