import { fetchQuery } from "convex/nextjs";
import { getConvexAuthToken } from "../auth/getConvexAuthToken";
import { getBlogForRouteQuery } from "../convex/references/getBlogForRouteQuery";
import { getBlogQuery } from "../convex/references/getBlogQuery";
import type { Id } from "../../../convex/_generated/dataModel";

type FetchDownloadBlogOptions = {
  blogId: Id<"blogs">;
  userId: string;
};

export const fetchDownloadBlog = async ({
  blogId,
  userId,
}: FetchDownloadBlogOptions) => {
  try {
    const token = await getConvexAuthToken();

    if (token) {
      return await fetchQuery(getBlogQuery, { blogId }, { token });
    }
  } catch {
    // Fall back to the route-authenticated query below.
  }

  return await fetchQuery(getBlogForRouteQuery, { blogId, userId });
};
