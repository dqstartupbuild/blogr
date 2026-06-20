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
import type * as identity_requireUserId from "../identity/requireUserId.js";
import type * as products_getCurrentProduct from "../products/getCurrentProduct.js";
import type * as products_saveProductScan from "../products/saveProductScan.js";
import type * as topics_createTopic from "../topics/createTopic.js";
import type * as topics_deleteTopic from "../topics/deleteTopic.js";
import type * as topics_getTopic from "../topics/getTopic.js";
import type * as topics_listTopics from "../topics/listTopics.js";
import type * as topics_updateTopicStatus from "../topics/updateTopicStatus.js";

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
  "identity/requireUserId": typeof identity_requireUserId;
  "products/getCurrentProduct": typeof products_getCurrentProduct;
  "products/saveProductScan": typeof products_saveProductScan;
  "topics/createTopic": typeof topics_createTopic;
  "topics/deleteTopic": typeof topics_deleteTopic;
  "topics/getTopic": typeof topics_getTopic;
  "topics/listTopics": typeof topics_listTopics;
  "topics/updateTopicStatus": typeof topics_updateTopicStatus;
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
