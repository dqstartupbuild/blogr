/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as blogs_getBlog from "../blogs/getBlog.js";
import type * as blogs_listBlogs from "../blogs/listBlogs.js";
import type * as blogs_refreshBlogImageUrls from "../blogs/refreshBlogImageUrls.js";
import type * as blogs_updateBlogContent from "../blogs/updateBlogContent.js";
import type * as blogs_upsertGeneratedBlog from "../blogs/upsertGeneratedBlog.js";
import type * as identity_getPreviewUserId from "../identity/getPreviewUserId.js";
import type * as identity_requireUserId from "../identity/requireUserId.js";
import type * as migrations_backfillProductWorkspaceIds from "../migrations/backfillProductWorkspaceIds.js";
import type * as products_blogGenerationSettingsValidator from "../products/blogGenerationSettingsValidator.js";
import type * as products_createImportedProductWorkspace from "../products/createImportedProductWorkspace.js";
import type * as products_createProductWorkspace from "../products/createProductWorkspace.js";
import type * as products_defaultBlogGenerationSettings from "../products/defaultBlogGenerationSettings.js";
import type * as products_getCurrentProduct from "../products/getCurrentProduct.js";
import type * as products_getProductForRag from "../products/getProductForRag.js";
import type * as products_getProductWorkspaces from "../products/getProductWorkspaces.js";
import type * as products_refreshProductImageUrls from "../products/refreshProductImageUrls.js";
import type * as products_resolveActiveProductId from "../products/resolveActiveProductId.js";
import type * as products_resolveReadableProductId from "../products/resolveReadableProductId.js";
import type * as products_saveProductScan from "../products/saveProductScan.js";
import type * as products_setActiveProductWorkspace from "../products/setActiveProductWorkspace.js";
import type * as products_updateBlogGenerationSettings from "../products/updateBlogGenerationSettings.js";
import type * as r2_buildR2ImageKey from "../r2/buildR2ImageKey.js";
import type * as r2_client from "../r2/client.js";
import type * as r2_getImageExtensionFromContentType from "../r2/getImageExtensionFromContentType.js";
import type * as r2_getR2ImageUrl from "../r2/getR2ImageUrl.js";
import type * as r2_getR2ImageUrls from "../r2/getR2ImageUrls.js";
import type * as r2_sanitizeR2KeyPart from "../r2/sanitizeR2KeyPart.js";
import type * as r2_storeImageFromUrl from "../r2/storeImageFromUrl.js";
import type * as rag_buildProductRagNamespace from "../rag/buildProductRagNamespace.js";
import type * as rag_buildProductRagText from "../rag/buildProductRagText.js";
import type * as rag_client from "../rag/client.js";
import type * as rag_indexProductContext from "../rag/indexProductContext.js";
import type * as rag_productRagKey from "../rag/productRagKey.js";
import type * as rag_searchProductContext from "../rag/searchProductContext.js";
import type * as topics_createTopic from "../topics/createTopic.js";
import type * as topics_deleteTopic from "../topics/deleteTopic.js";
import type * as topics_getTopic from "../topics/getTopic.js";
import type * as topics_listTopics from "../topics/listTopics.js";
import type * as topics_updateTopicStatus from "../topics/updateTopicStatus.js";
import type * as workspaceSelections_saveWorkspaceSelection from "../workspaceSelections/saveWorkspaceSelection.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "blogs/getBlog": typeof blogs_getBlog;
  "blogs/listBlogs": typeof blogs_listBlogs;
  "blogs/refreshBlogImageUrls": typeof blogs_refreshBlogImageUrls;
  "blogs/updateBlogContent": typeof blogs_updateBlogContent;
  "blogs/upsertGeneratedBlog": typeof blogs_upsertGeneratedBlog;
  "identity/getPreviewUserId": typeof identity_getPreviewUserId;
  "identity/requireUserId": typeof identity_requireUserId;
  "migrations/backfillProductWorkspaceIds": typeof migrations_backfillProductWorkspaceIds;
  "products/blogGenerationSettingsValidator": typeof products_blogGenerationSettingsValidator;
  "products/createImportedProductWorkspace": typeof products_createImportedProductWorkspace;
  "products/createProductWorkspace": typeof products_createProductWorkspace;
  "products/defaultBlogGenerationSettings": typeof products_defaultBlogGenerationSettings;
  "products/getCurrentProduct": typeof products_getCurrentProduct;
  "products/getProductForRag": typeof products_getProductForRag;
  "products/getProductWorkspaces": typeof products_getProductWorkspaces;
  "products/refreshProductImageUrls": typeof products_refreshProductImageUrls;
  "products/resolveActiveProductId": typeof products_resolveActiveProductId;
  "products/resolveReadableProductId": typeof products_resolveReadableProductId;
  "products/saveProductScan": typeof products_saveProductScan;
  "products/setActiveProductWorkspace": typeof products_setActiveProductWorkspace;
  "products/updateBlogGenerationSettings": typeof products_updateBlogGenerationSettings;
  "r2/buildR2ImageKey": typeof r2_buildR2ImageKey;
  "r2/client": typeof r2_client;
  "r2/getImageExtensionFromContentType": typeof r2_getImageExtensionFromContentType;
  "r2/getR2ImageUrl": typeof r2_getR2ImageUrl;
  "r2/getR2ImageUrls": typeof r2_getR2ImageUrls;
  "r2/sanitizeR2KeyPart": typeof r2_sanitizeR2KeyPart;
  "r2/storeImageFromUrl": typeof r2_storeImageFromUrl;
  "rag/buildProductRagNamespace": typeof rag_buildProductRagNamespace;
  "rag/buildProductRagText": typeof rag_buildProductRagText;
  "rag/client": typeof rag_client;
  "rag/indexProductContext": typeof rag_indexProductContext;
  "rag/productRagKey": typeof rag_productRagKey;
  "rag/searchProductContext": typeof rag_searchProductContext;
  "topics/createTopic": typeof topics_createTopic;
  "topics/deleteTopic": typeof topics_deleteTopic;
  "topics/getTopic": typeof topics_getTopic;
  "topics/listTopics": typeof topics_listTopics;
  "topics/updateTopicStatus": typeof topics_updateTopicStatus;
  "workspaceSelections/saveWorkspaceSelection": typeof workspaceSelections_saveWorkspaceSelection;
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
