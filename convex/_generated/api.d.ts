/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as blogs_buildBlogSearchText from "../blogs/buildBlogSearchText.js";
import type * as blogs_countBlogImageUrls from "../blogs/countBlogImageUrls.js";
import type * as blogs_deleteBlog from "../blogs/deleteBlog.js";
import type * as blogs_getBlog from "../blogs/getBlog.js";
import type * as blogs_listBlogTopicKeywords from "../blogs/listBlogTopicKeywords.js";
import type * as blogs_listBlogs from "../blogs/listBlogs.js";
import type * as blogs_markBlogPublished from "../blogs/markBlogPublished.js";
import type * as blogs_refreshBlogImageUrls from "../blogs/refreshBlogImageUrls.js";
import type * as blogs_seoContentLengthLimits from "../blogs/seoContentLengthLimits.js";
import type * as blogs_updateBlogContent from "../blogs/updateBlogContent.js";
import type * as blogs_updateBlogImage from "../blogs/updateBlogImage.js";
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
import type * as products_getProductForRag from "../products/getProductForRag.js";
import type * as products_getProductWorkspaces from "../products/getProductWorkspaces.js";
import type * as products_publishBlogWithIntegration from "../products/publishBlogWithIntegration.js";
import type * as products_readBlogPublishingWebhookMessage from "../products/readBlogPublishingWebhookMessage.js";
import type * as products_refreshProductImageUrls from "../products/refreshProductImageUrls.js";
import type * as products_resolveActiveProductId from "../products/resolveActiveProductId.js";
import type * as products_sanitizeBlogPublishingIntegration from "../products/sanitizeBlogPublishingIntegration.js";
import type * as products_sanitizeProductForClient from "../products/sanitizeProductForClient.js";
import type * as products_saveProductScan from "../products/saveProductScan.js";
import type * as products_setActiveProductWorkspace from "../products/setActiveProductWorkspace.js";
import type * as products_updateBlogGenerationSettings from "../products/updateBlogGenerationSettings.js";
import type * as products_updateBlogPublishingIntegration from "../products/updateBlogPublishingIntegration.js";
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
  "blogs/buildBlogSearchText": typeof blogs_buildBlogSearchText;
  "blogs/countBlogImageUrls": typeof blogs_countBlogImageUrls;
  "blogs/deleteBlog": typeof blogs_deleteBlog;
  "blogs/getBlog": typeof blogs_getBlog;
  "blogs/listBlogTopicKeywords": typeof blogs_listBlogTopicKeywords;
  "blogs/listBlogs": typeof blogs_listBlogs;
  "blogs/markBlogPublished": typeof blogs_markBlogPublished;
  "blogs/refreshBlogImageUrls": typeof blogs_refreshBlogImageUrls;
  "blogs/seoContentLengthLimits": typeof blogs_seoContentLengthLimits;
  "blogs/updateBlogContent": typeof blogs_updateBlogContent;
  "blogs/updateBlogImage": typeof blogs_updateBlogImage;
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
  "products/getProductForRag": typeof products_getProductForRag;
  "products/getProductWorkspaces": typeof products_getProductWorkspaces;
  "products/publishBlogWithIntegration": typeof products_publishBlogWithIntegration;
  "products/readBlogPublishingWebhookMessage": typeof products_readBlogPublishingWebhookMessage;
  "products/refreshProductImageUrls": typeof products_refreshProductImageUrls;
  "products/resolveActiveProductId": typeof products_resolveActiveProductId;
  "products/sanitizeBlogPublishingIntegration": typeof products_sanitizeBlogPublishingIntegration;
  "products/sanitizeProductForClient": typeof products_sanitizeProductForClient;
  "products/saveProductScan": typeof products_saveProductScan;
  "products/setActiveProductWorkspace": typeof products_setActiveProductWorkspace;
  "products/updateBlogGenerationSettings": typeof products_updateBlogGenerationSettings;
  "products/updateBlogPublishingIntegration": typeof products_updateBlogPublishingIntegration;
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
