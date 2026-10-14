import type { LocalState } from "../domain/LocalState";

import { getProductWorkspaces } from "./queries/getProductWorkspaces";
import { getCurrentProduct } from "./queries/getCurrentProduct";
import { queryTopic } from "./queries/queryTopic";
import { queryBlog } from "./queries/queryBlog";
import { listTopics } from "./queries/listTopics";
import { listBlogs } from "./queries/listBlogs";
import { listScheduledTopics } from "./queries/listScheduledTopics";
import { listTopicKeywords } from "./queries/listTopicKeywords";
import { listBlogTopicKeywords } from "./queries/listBlogTopicKeywords";
import { getWorkspaceSummary } from "./queries/getWorkspaceSummary";
import { listBlogVersions } from "./queries/listBlogVersions";
import { getBlogVersion } from "./queries/getBlogVersion";

export const queryLocalState = (state: LocalState, name: string, args: Record<string, unknown> = {}): unknown => {
  switch (name) {
    case "getProductWorkspacesQuery": return getProductWorkspaces(state);
    case "getCurrentProductProfileQuery":
    case "getCurrentProductQuery": return getCurrentProduct(state, args);
    case "getBlogQuery": return queryBlog(state, name, args);
    case "getTopicQuery": return queryTopic(state, name, args);
    case "listTopicsQuery": return listTopics(state, args);
    case "listBlogsQuery": return listBlogs(state, args);
    case "listScheduledTopicsQuery": return listScheduledTopics(state, args);
    case "listTopicKeywordsQuery": return listTopicKeywords(state, args);
    case "listBlogTopicKeywordsQuery": return listBlogTopicKeywords(state, args);
    case "getWorkspaceSummaryQuery": return getWorkspaceSummary(state, args);
    case "listBlogVersionsQuery": return listBlogVersions(state, args);
    case "getBlogVersionQuery": return getBlogVersion(state, args);
    default: throw new Error(`Unknown local query: ${name}`);
  }
};
