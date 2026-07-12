/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiJobs_aiJobStatusValidator from "../aiJobs/aiJobStatusValidator.js";
import type * as aiJobs_aiJobTypeValidator from "../aiJobs/aiJobTypeValidator.js";
import type * as aiJobs_assertAiWorkerSecret from "../aiJobs/assertAiWorkerSecret.js";
import type * as aiJobs_claimNextAiJob from "../aiJobs/claimNextAiJob.js";
import type * as aiJobs_completeAiJob from "../aiJobs/completeAiJob.js";
import type * as aiJobs_completeBlogGenerateAiJob from "../aiJobs/completeBlogGenerateAiJob.js";
import type * as aiJobs_completeImageRegenerationAiJob from "../aiJobs/completeImageRegenerationAiJob.js";
import type * as aiJobs_completeProductScanAiJob from "../aiJobs/completeProductScanAiJob.js";
import type * as aiJobs_completeTopicBatchPlanAiJob from "../aiJobs/completeTopicBatchPlanAiJob.js";
import type * as aiJobs_completeTopicBriefAiJob from "../aiJobs/completeTopicBriefAiJob.js";
import type * as aiJobs_createAiJob from "../aiJobs/createAiJob.js";
import type * as aiJobs_failAiJob from "../aiJobs/failAiJob.js";
import type * as aiJobs_getAiJob from "../aiJobs/getAiJob.js";
import type * as aiJobs_imageValidator from "../aiJobs/imageValidator.js";
import type * as aiJobs_linkValidator from "../aiJobs/linkValidator.js";
import type * as blogs_buildBlogSearchText from "../blogs/buildBlogSearchText.js";
import type * as blogs_countBlogImageUrls from "../blogs/countBlogImageUrls.js";
import type * as blogs_deleteBlog from "../blogs/deleteBlog.js";
import type * as blogs_getBlog from "../blogs/getBlog.js";
import type * as blogs_listBlogTopicKeywords from "../blogs/listBlogTopicKeywords.js";
import type * as blogs_listBlogs from "../blogs/listBlogs.js";
import type * as blogs_markBlogPublished from "../blogs/markBlogPublished.js";
import type * as blogs_refreshBlogImageUrls from "../blogs/refreshBlogImageUrls.js";
import type * as blogs_resolveBlogPublishedAt from "../blogs/resolveBlogPublishedAt.js";
import type * as blogs_seoContentLengthLimits from "../blogs/seoContentLengthLimits.js";
import type * as blogs_updateBlogContent from "../blogs/updateBlogContent.js";
import type * as blogs_updateBlogImage from "../blogs/updateBlogImage.js";
import type * as blogs_updateBlogImages from "../blogs/updateBlogImages.js";
import type * as blogs_upsertGeneratedBlog from "../blogs/upsertGeneratedBlog.js";
import type * as blogs_validateSeoContentLengths from "../blogs/validateSeoContentLengths.js";
import type * as identity_getPreviewUserId from "../identity/getPreviewUserId.js";
import type * as identity_requireUserId from "../identity/requireUserId.js";
import type * as migrations_backfillProductWorkspaceIds from "../migrations/backfillProductWorkspaceIds.js";
import type * as products_applyBlogPublishingSourceName from "../products/applyBlogPublishingSourceName.js";
import type * as products_blogGenerationSettingsValidator from "../products/blogGenerationSettingsValidator.js";
import type * as products_blogPublishArticleValidator from "../products/blogPublishArticleValidator.js";
import type * as products_blogPublishPayloadValidator from "../products/blogPublishPayloadValidator.js";
import type * as products_blogPublishingIntegrationValidator from "../products/blogPublishingIntegrationValidator.js";
import type * as products_buildBlogPublishingWebhookErrorMessage from "../products/buildBlogPublishingWebhookErrorMessage.js";
import type * as products_createImportedProductWorkspace from "../products/createImportedProductWorkspace.js";
import type * as products_createProductWorkspace from "../products/createProductWorkspace.js";
import type * as products_defaultBlogGenerationSettings from "../products/defaultBlogGenerationSettings.js";
import type * as products_getBlogPublishingIntegration from "../products/getBlogPublishingIntegration.js";
import type * as products_getCurrentProduct from "../products/getCurrentProduct.js";
import type * as products_getCurrentProductProfile from "../products/getCurrentProductProfile.js";
import type * as products_getProductForRag from "../products/getProductForRag.js";
import type * as products_getProductWorkspaces from "../products/getProductWorkspaces.js";
import type * as products_productExternalLinkValidator from "../products/productExternalLinkValidator.js";
import type * as products_productPriceValidator from "../products/productPriceValidator.js";
import type * as products_publishBlogWithIntegration from "../products/publishBlogWithIntegration.js";
import type * as products_readBlogPublishingWebhookMessage from "../products/readBlogPublishingWebhookMessage.js";
import type * as products_refreshProductImageUrls from "../products/refreshProductImageUrls.js";
import type * as products_resolveActiveProductId from "../products/resolveActiveProductId.js";
import type * as products_sanitizeBlogPublishingIntegration from "../products/sanitizeBlogPublishingIntegration.js";
import type * as products_sanitizeProductExternalLinks from "../products/sanitizeProductExternalLinks.js";
import type * as products_sanitizeProductForClient from "../products/sanitizeProductForClient.js";
import type * as products_sanitizeProductPrices from "../products/sanitizeProductPrices.js";
import type * as products_sanitizeProductStringList from "../products/sanitizeProductStringList.js";
import type * as products_saveProductScan from "../products/saveProductScan.js";
import type * as products_setActiveProductWorkspace from "../products/setActiveProductWorkspace.js";
import type * as products_updateBlogGenerationSettings from "../products/updateBlogGenerationSettings.js";
import type * as products_updateBlogPublishingIntegration from "../products/updateBlogPublishingIntegration.js";
import type * as products_updateProductDetails from "../products/updateProductDetails.js";
import type * as products_updateProductSiteLinks from "../products/updateProductSiteLinks.js";
import type * as r2_buildR2ImageKey from "../r2/buildR2ImageKey.js";
import type * as r2_client from "../r2/client.js";
import type * as r2_getImageExtensionFromContentType from "../r2/getImageExtensionFromContentType.js";
import type * as r2_getR2ImageUrl from "../r2/getR2ImageUrl.js";
import type * as r2_getR2ImageUrls from "../r2/getR2ImageUrls.js";
import type * as r2_getSignedImageUrlExpirationMs from "../r2/getSignedImageUrlExpirationMs.js";
import type * as r2_sanitizeR2KeyPart from "../r2/sanitizeR2KeyPart.js";
import type * as r2_shouldRefreshSignedImageUrl from "../r2/shouldRefreshSignedImageUrl.js";
import type * as r2_storeImageFromUrl from "../r2/storeImageFromUrl.js";
import type * as rag_buildProductRagNamespace from "../rag/buildProductRagNamespace.js";
import type * as rag_buildProductRagText from "../rag/buildProductRagText.js";
import type * as rag_client from "../rag/client.js";
import type * as rag_indexProductContext from "../rag/indexProductContext.js";
import type * as rag_productRagKey from "../rag/productRagKey.js";
import type * as rag_searchProductContext from "../rag/searchProductContext.js";
import type * as readModels_BlogReadModelSource from "../readModels/BlogReadModelSource.js";
import type * as readModels_ProductProfileSource from "../readModels/ProductProfileSource.js";
import type * as readModels_ProductWorkspaceSummarySource from "../readModels/ProductWorkspaceSummarySource.js";
import type * as readModels_TopicReadModelSource from "../readModels/TopicReadModelSource.js";
import type * as readModels_WorkspaceStatDelta from "../readModels/WorkspaceStatDelta.js";
import type * as readModels_applyWorkspaceStatDelta from "../readModels/applyWorkspaceStatDelta.js";
import type * as readModels_buildBlogKeywordOption from "../readModels/buildBlogKeywordOption.js";
import type * as readModels_buildBlogSummary from "../readModels/buildBlogSummary.js";
import type * as readModels_buildProductProfile from "../readModels/buildProductProfile.js";
import type * as readModels_buildProductWorkspaceSummary from "../readModels/buildProductWorkspaceSummary.js";
import type * as readModels_buildTopicKeywordOption from "../readModels/buildTopicKeywordOption.js";
import type * as readModels_countBlogImageRefs from "../readModels/countBlogImageRefs.js";
import type * as readModels_countBlogWordsFromMdx from "../readModels/countBlogWordsFromMdx.js";
import type * as readModels_deleteBlogReadModels from "../readModels/deleteBlogReadModels.js";
import type * as readModels_deleteTopicReadModel from "../readModels/deleteTopicReadModel.js";
import type * as readModels_ensureProductWorkspaceSummaries from "../readModels/ensureProductWorkspaceSummaries.js";
import type * as readModels_ensureWorkspaceReadModels from "../readModels/ensureWorkspaceReadModels.js";
import type * as readModels_findBlogKeywordOptionByBlogId from "../readModels/findBlogKeywordOptionByBlogId.js";
import type * as readModels_findBlogSummaryByBlogId from "../readModels/findBlogSummaryByBlogId.js";
import type * as readModels_findBlogSummaryByTopicId from "../readModels/findBlogSummaryByTopicId.js";
import type * as readModels_findProductProfile from "../readModels/findProductProfile.js";
import type * as readModels_findProductWorkspaceSummary from "../readModels/findProductWorkspaceSummary.js";
import type * as readModels_findTopicKeywordOptionByTopicId from "../readModels/findTopicKeywordOptionByTopicId.js";
import type * as readModels_findWorkspaceStats from "../readModels/findWorkspaceStats.js";
import type * as readModels_patchProductProfile from "../readModels/patchProductProfile.js";
import type * as readModels_touchProductWorkspaceSummary from "../readModels/touchProductWorkspaceSummary.js";
import type * as readModels_upsertBlogReadModels from "../readModels/upsertBlogReadModels.js";
import type * as readModels_upsertProductProfile from "../readModels/upsertProductProfile.js";
import type * as readModels_upsertProductWorkspaceSummary from "../readModels/upsertProductWorkspaceSummary.js";
import type * as readModels_upsertTopicReadModel from "../readModels/upsertTopicReadModel.js";
import type * as topics_backfillWrittenTopicCalendarDates from "../topics/backfillWrittenTopicCalendarDates.js";
import type * as topics_buildTopicIntentKey from "../topics/buildTopicIntentKey.js";
import type * as topics_buildTopicSearchText from "../topics/buildTopicSearchText.js";
import type * as topics_createScheduledTopic from "../topics/createScheduledTopic.js";
import type * as topics_createScheduledTopicBatch from "../topics/createScheduledTopicBatch.js";
import type * as topics_createTopic from "../topics/createTopic.js";
import type * as topics_deleteTopic from "../topics/deleteTopic.js";
import type * as topics_getCalendarDateKeyFromTimestamp from "../topics/getCalendarDateKeyFromTimestamp.js";
import type * as topics_getTopic from "../topics/getTopic.js";
import type * as topics_listScheduledTopics from "../topics/listScheduledTopics.js";
import type * as topics_listTopicKeywords from "../topics/listTopicKeywords.js";
import type * as topics_listTopics from "../topics/listTopics.js";
import type * as topics_normalizeTopicIntentToken from "../topics/normalizeTopicIntentToken.js";
import type * as topics_normalizeTopicKeyword from "../topics/normalizeTopicKeyword.js";
import type * as topics_removeTopicPlannerPrefix from "../topics/removeTopicPlannerPrefix.js";
import type * as topics_resolveTopicStatusFromBlog from "../topics/resolveTopicStatusFromBlog.js";
import type * as topics_tokenizeTopicIntent from "../topics/tokenizeTopicIntent.js";
import type * as topics_topicIntentStopWords from "../topics/topicIntentStopWords.js";
import type * as topics_topicSourceTypeValidator from "../topics/topicSourceTypeValidator.js";
import type * as topics_topicStatusValidator from "../topics/topicStatusValidator.js";
import type * as topics_updateTopicNotes from "../topics/updateTopicNotes.js";
import type * as topics_updateTopicScheduledDate from "../topics/updateTopicScheduledDate.js";
import type * as topics_updateTopicStatus from "../topics/updateTopicStatus.js";
import type * as workspaceSelections_saveWorkspaceSelection from "../workspaceSelections/saveWorkspaceSelection.js";
import type * as workspaces_getWorkspaceSummary from "../workspaces/getWorkspaceSummary.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "aiJobs/aiJobStatusValidator": typeof aiJobs_aiJobStatusValidator;
  "aiJobs/aiJobTypeValidator": typeof aiJobs_aiJobTypeValidator;
  "aiJobs/assertAiWorkerSecret": typeof aiJobs_assertAiWorkerSecret;
  "aiJobs/claimNextAiJob": typeof aiJobs_claimNextAiJob;
  "aiJobs/completeAiJob": typeof aiJobs_completeAiJob;
  "aiJobs/completeBlogGenerateAiJob": typeof aiJobs_completeBlogGenerateAiJob;
  "aiJobs/completeImageRegenerationAiJob": typeof aiJobs_completeImageRegenerationAiJob;
  "aiJobs/completeProductScanAiJob": typeof aiJobs_completeProductScanAiJob;
  "aiJobs/completeTopicBatchPlanAiJob": typeof aiJobs_completeTopicBatchPlanAiJob;
  "aiJobs/completeTopicBriefAiJob": typeof aiJobs_completeTopicBriefAiJob;
  "aiJobs/createAiJob": typeof aiJobs_createAiJob;
  "aiJobs/failAiJob": typeof aiJobs_failAiJob;
  "aiJobs/getAiJob": typeof aiJobs_getAiJob;
  "aiJobs/imageValidator": typeof aiJobs_imageValidator;
  "aiJobs/linkValidator": typeof aiJobs_linkValidator;
  "blogs/buildBlogSearchText": typeof blogs_buildBlogSearchText;
  "blogs/countBlogImageUrls": typeof blogs_countBlogImageUrls;
  "blogs/deleteBlog": typeof blogs_deleteBlog;
  "blogs/getBlog": typeof blogs_getBlog;
  "blogs/listBlogTopicKeywords": typeof blogs_listBlogTopicKeywords;
  "blogs/listBlogs": typeof blogs_listBlogs;
  "blogs/markBlogPublished": typeof blogs_markBlogPublished;
  "blogs/refreshBlogImageUrls": typeof blogs_refreshBlogImageUrls;
  "blogs/resolveBlogPublishedAt": typeof blogs_resolveBlogPublishedAt;
  "blogs/seoContentLengthLimits": typeof blogs_seoContentLengthLimits;
  "blogs/updateBlogContent": typeof blogs_updateBlogContent;
  "blogs/updateBlogImage": typeof blogs_updateBlogImage;
  "blogs/updateBlogImages": typeof blogs_updateBlogImages;
  "blogs/upsertGeneratedBlog": typeof blogs_upsertGeneratedBlog;
  "blogs/validateSeoContentLengths": typeof blogs_validateSeoContentLengths;
  "identity/getPreviewUserId": typeof identity_getPreviewUserId;
  "identity/requireUserId": typeof identity_requireUserId;
  "migrations/backfillProductWorkspaceIds": typeof migrations_backfillProductWorkspaceIds;
  "products/applyBlogPublishingSourceName": typeof products_applyBlogPublishingSourceName;
  "products/blogGenerationSettingsValidator": typeof products_blogGenerationSettingsValidator;
  "products/blogPublishArticleValidator": typeof products_blogPublishArticleValidator;
  "products/blogPublishPayloadValidator": typeof products_blogPublishPayloadValidator;
  "products/blogPublishingIntegrationValidator": typeof products_blogPublishingIntegrationValidator;
  "products/buildBlogPublishingWebhookErrorMessage": typeof products_buildBlogPublishingWebhookErrorMessage;
  "products/createImportedProductWorkspace": typeof products_createImportedProductWorkspace;
  "products/createProductWorkspace": typeof products_createProductWorkspace;
  "products/defaultBlogGenerationSettings": typeof products_defaultBlogGenerationSettings;
  "products/getBlogPublishingIntegration": typeof products_getBlogPublishingIntegration;
  "products/getCurrentProduct": typeof products_getCurrentProduct;
  "products/getCurrentProductProfile": typeof products_getCurrentProductProfile;
  "products/getProductForRag": typeof products_getProductForRag;
  "products/getProductWorkspaces": typeof products_getProductWorkspaces;
  "products/productExternalLinkValidator": typeof products_productExternalLinkValidator;
  "products/productPriceValidator": typeof products_productPriceValidator;
  "products/publishBlogWithIntegration": typeof products_publishBlogWithIntegration;
  "products/readBlogPublishingWebhookMessage": typeof products_readBlogPublishingWebhookMessage;
  "products/refreshProductImageUrls": typeof products_refreshProductImageUrls;
  "products/resolveActiveProductId": typeof products_resolveActiveProductId;
  "products/sanitizeBlogPublishingIntegration": typeof products_sanitizeBlogPublishingIntegration;
  "products/sanitizeProductExternalLinks": typeof products_sanitizeProductExternalLinks;
  "products/sanitizeProductForClient": typeof products_sanitizeProductForClient;
  "products/sanitizeProductPrices": typeof products_sanitizeProductPrices;
  "products/sanitizeProductStringList": typeof products_sanitizeProductStringList;
  "products/saveProductScan": typeof products_saveProductScan;
  "products/setActiveProductWorkspace": typeof products_setActiveProductWorkspace;
  "products/updateBlogGenerationSettings": typeof products_updateBlogGenerationSettings;
  "products/updateBlogPublishingIntegration": typeof products_updateBlogPublishingIntegration;
  "products/updateProductDetails": typeof products_updateProductDetails;
  "products/updateProductSiteLinks": typeof products_updateProductSiteLinks;
  "r2/buildR2ImageKey": typeof r2_buildR2ImageKey;
  "r2/client": typeof r2_client;
  "r2/getImageExtensionFromContentType": typeof r2_getImageExtensionFromContentType;
  "r2/getR2ImageUrl": typeof r2_getR2ImageUrl;
  "r2/getR2ImageUrls": typeof r2_getR2ImageUrls;
  "r2/getSignedImageUrlExpirationMs": typeof r2_getSignedImageUrlExpirationMs;
  "r2/sanitizeR2KeyPart": typeof r2_sanitizeR2KeyPart;
  "r2/shouldRefreshSignedImageUrl": typeof r2_shouldRefreshSignedImageUrl;
  "r2/storeImageFromUrl": typeof r2_storeImageFromUrl;
  "rag/buildProductRagNamespace": typeof rag_buildProductRagNamespace;
  "rag/buildProductRagText": typeof rag_buildProductRagText;
  "rag/client": typeof rag_client;
  "rag/indexProductContext": typeof rag_indexProductContext;
  "rag/productRagKey": typeof rag_productRagKey;
  "rag/searchProductContext": typeof rag_searchProductContext;
  "readModels/BlogReadModelSource": typeof readModels_BlogReadModelSource;
  "readModels/ProductProfileSource": typeof readModels_ProductProfileSource;
  "readModels/ProductWorkspaceSummarySource": typeof readModels_ProductWorkspaceSummarySource;
  "readModels/TopicReadModelSource": typeof readModels_TopicReadModelSource;
  "readModels/WorkspaceStatDelta": typeof readModels_WorkspaceStatDelta;
  "readModels/applyWorkspaceStatDelta": typeof readModels_applyWorkspaceStatDelta;
  "readModels/buildBlogKeywordOption": typeof readModels_buildBlogKeywordOption;
  "readModels/buildBlogSummary": typeof readModels_buildBlogSummary;
  "readModels/buildProductProfile": typeof readModels_buildProductProfile;
  "readModels/buildProductWorkspaceSummary": typeof readModels_buildProductWorkspaceSummary;
  "readModels/buildTopicKeywordOption": typeof readModels_buildTopicKeywordOption;
  "readModels/countBlogImageRefs": typeof readModels_countBlogImageRefs;
  "readModels/countBlogWordsFromMdx": typeof readModels_countBlogWordsFromMdx;
  "readModels/deleteBlogReadModels": typeof readModels_deleteBlogReadModels;
  "readModels/deleteTopicReadModel": typeof readModels_deleteTopicReadModel;
  "readModels/ensureProductWorkspaceSummaries": typeof readModels_ensureProductWorkspaceSummaries;
  "readModels/ensureWorkspaceReadModels": typeof readModels_ensureWorkspaceReadModels;
  "readModels/findBlogKeywordOptionByBlogId": typeof readModels_findBlogKeywordOptionByBlogId;
  "readModels/findBlogSummaryByBlogId": typeof readModels_findBlogSummaryByBlogId;
  "readModels/findBlogSummaryByTopicId": typeof readModels_findBlogSummaryByTopicId;
  "readModels/findProductProfile": typeof readModels_findProductProfile;
  "readModels/findProductWorkspaceSummary": typeof readModels_findProductWorkspaceSummary;
  "readModels/findTopicKeywordOptionByTopicId": typeof readModels_findTopicKeywordOptionByTopicId;
  "readModels/findWorkspaceStats": typeof readModels_findWorkspaceStats;
  "readModels/patchProductProfile": typeof readModels_patchProductProfile;
  "readModels/touchProductWorkspaceSummary": typeof readModels_touchProductWorkspaceSummary;
  "readModels/upsertBlogReadModels": typeof readModels_upsertBlogReadModels;
  "readModels/upsertProductProfile": typeof readModels_upsertProductProfile;
  "readModels/upsertProductWorkspaceSummary": typeof readModels_upsertProductWorkspaceSummary;
  "readModels/upsertTopicReadModel": typeof readModels_upsertTopicReadModel;
  "topics/backfillWrittenTopicCalendarDates": typeof topics_backfillWrittenTopicCalendarDates;
  "topics/buildTopicIntentKey": typeof topics_buildTopicIntentKey;
  "topics/buildTopicSearchText": typeof topics_buildTopicSearchText;
  "topics/createScheduledTopic": typeof topics_createScheduledTopic;
  "topics/createScheduledTopicBatch": typeof topics_createScheduledTopicBatch;
  "topics/createTopic": typeof topics_createTopic;
  "topics/deleteTopic": typeof topics_deleteTopic;
  "topics/getCalendarDateKeyFromTimestamp": typeof topics_getCalendarDateKeyFromTimestamp;
  "topics/getTopic": typeof topics_getTopic;
  "topics/listScheduledTopics": typeof topics_listScheduledTopics;
  "topics/listTopicKeywords": typeof topics_listTopicKeywords;
  "topics/listTopics": typeof topics_listTopics;
  "topics/normalizeTopicIntentToken": typeof topics_normalizeTopicIntentToken;
  "topics/normalizeTopicKeyword": typeof topics_normalizeTopicKeyword;
  "topics/removeTopicPlannerPrefix": typeof topics_removeTopicPlannerPrefix;
  "topics/resolveTopicStatusFromBlog": typeof topics_resolveTopicStatusFromBlog;
  "topics/tokenizeTopicIntent": typeof topics_tokenizeTopicIntent;
  "topics/topicIntentStopWords": typeof topics_topicIntentStopWords;
  "topics/topicSourceTypeValidator": typeof topics_topicSourceTypeValidator;
  "topics/topicStatusValidator": typeof topics_topicStatusValidator;
  "topics/updateTopicNotes": typeof topics_updateTopicNotes;
  "topics/updateTopicScheduledDate": typeof topics_updateTopicScheduledDate;
  "topics/updateTopicStatus": typeof topics_updateTopicStatus;
  "workspaceSelections/saveWorkspaceSelection": typeof workspaceSelections_saveWorkspaceSelection;
  "workspaces/getWorkspaceSummary": typeof workspaces_getWorkspaceSummary;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: import("@convex-dev/r2/_generated/component.js").ComponentApi<"r2">;
  rag: import("@convex-dev/rag/_generated/component.js").ComponentApi<"rag">;
};
