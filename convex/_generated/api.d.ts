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
import type * as blogs_updateBlogContent from "../blogs/updateBlogContent.js";
import type * as blogs_upsertGeneratedBlog from "../blogs/upsertGeneratedBlog.js";
import type * as identity_getPreviewUserId from "../identity/getPreviewUserId.js";
import type * as identity_requireUserId from "../identity/requireUserId.js";
import type * as migrations_backfillProductWorkspaceIds from "../migrations/backfillProductWorkspaceIds.js";
import type * as products_createImportedProductWorkspace from "../products/createImportedProductWorkspace.js";
import type * as products_createProductWorkspace from "../products/createProductWorkspace.js";
import type * as products_getCurrentProduct from "../products/getCurrentProduct.js";
import type * as products_getProductWorkspaces from "../products/getProductWorkspaces.js";
import type * as products_resolveActiveProductId from "../products/resolveActiveProductId.js";
import type * as products_saveProductScan from "../products/saveProductScan.js";
import type * as products_setActiveProductWorkspace from "../products/setActiveProductWorkspace.js";
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
  "blogs/updateBlogContent": typeof blogs_updateBlogContent;
  "blogs/upsertGeneratedBlog": typeof blogs_upsertGeneratedBlog;
  "identity/getPreviewUserId": typeof identity_getPreviewUserId;
  "identity/requireUserId": typeof identity_requireUserId;
  "migrations/backfillProductWorkspaceIds": typeof migrations_backfillProductWorkspaceIds;
  "products/createImportedProductWorkspace": typeof products_createImportedProductWorkspace;
  "products/createProductWorkspace": typeof products_createProductWorkspace;
  "products/getCurrentProduct": typeof products_getCurrentProduct;
  "products/getProductWorkspaces": typeof products_getProductWorkspaces;
  "products/resolveActiveProductId": typeof products_resolveActiveProductId;
  "products/saveProductScan": typeof products_saveProductScan;
  "products/setActiveProductWorkspace": typeof products_setActiveProductWorkspace;
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

export declare const components: {};
