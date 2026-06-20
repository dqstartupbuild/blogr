import { fetchQuery } from "convex/nextjs";
import { getConvexAuthToken } from "../auth/getConvexAuthToken";
import { getBlogForRouteQuery } from "./references/getBlogForRouteQuery";
import { getBlogQuery } from "./references/getBlogQuery";
import type { Id } from "../../../convex/_generated/dataModel";

type FetchRouteBlogOptions = {
  blogId: Id<"blogs">;
  userId: string;
};

export const fetchRouteBlog = async ({
  blogId,
  userId,
}: FetchRouteBlogOptions) => {
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
