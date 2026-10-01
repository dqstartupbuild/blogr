import type { LocalState } from "../domain/LocalState";
import type { getBlogVersion } from "./queries/getBlogVersion";
import type { getWorkspaceSummary } from "./queries/getWorkspaceSummary";
import type { listBlogVersions } from "./queries/listBlogVersions";
import type { listBlogs } from "./queries/listBlogs";
import type { listScheduledTopics } from "./queries/listScheduledTopics";
import type { listTopics } from "./queries/listTopics";

export type LocalQueryResults = {
  getProductWorkspacesQuery: { activeProductId?: string; products: Array<LocalState["products"][number] & { _id: string }> };
  getCurrentProductProfileQuery: LocalState["products"][number] | null;
  getCurrentProductQuery: LocalState["products"][number] | null;
  getBlogQuery: (LocalState["blogs"][number] & { _id: string }) | null;
  getTopicQuery: LocalState["topics"][number] | null;
  listTopicsQuery: ReturnType<typeof listTopics>;
  listBlogsQuery: ReturnType<typeof listBlogs>;
  listScheduledTopicsQuery: ReturnType<typeof listScheduledTopics>;
  listTopicKeywordsQuery: LocalState["topics"];
  listBlogTopicKeywordsQuery: string[];
  getWorkspaceSummaryQuery: ReturnType<typeof getWorkspaceSummary>;
  listBlogVersionsQuery: ReturnType<typeof listBlogVersions>;
  getBlogVersionQuery: ReturnType<typeof getBlogVersion>;
};

export type LocalQueryName = keyof LocalQueryResults;
