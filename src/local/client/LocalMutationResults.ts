export type LocalMutationResults = {
  createProductWorkspaceMutation: string;
  deleteProductWorkspaceMutation: string;
  setActiveProductWorkspaceMutation: string;
  saveProductScanMutation: string;
  updateProductDetailsMutation: string;
  updateProductSiteLinksMutation: string;
  updateBlogGenerationSettingsMutation: string;
  updateCalendarQueueSettingsMutation: string;
  updateBlogPublishingIntegrationMutation: string;
  createTopicMutation: string;
  createScheduledTopicMutation: string;
  createScheduledTopicBatchMutation: { createdCount: number; skippedCount: number };
  quickFillExistingTopicsMutation: { scheduledCount: number; skippedOccupiedDateCount: number; unusedDateCount: number };
  deleteTopicMutation: string;
  updateTopicNotesMutation: string;
  updateTopicScheduledDateMutation: string;
  updateTopicStatusMutation: string;
  upsertGeneratedBlogMutation: string;
  deleteBlogMutation: string;
  updateBlogContentMutation: string;
  updateBlogImagesMutation: { blogId: string; updatedAt: number };
  updateBlogImageMutation: { blogId: string; updatedAt: number };
  markBlogPublishedMutation: string;
};

export type LocalMutationName = keyof LocalMutationResults;
