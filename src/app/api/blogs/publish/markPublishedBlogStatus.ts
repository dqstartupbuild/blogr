import { fetchMutation } from "convex/nextjs";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { getConvexAuthToken } from "@/server/auth/getConvexAuthToken";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { hasConvexUrl } from "@/server/convex/hasConvexUrl";
import { markBlogPublishedMutation } from "@/server/convex/references/markBlogPublishedMutation";

export const markPublishedBlogStatus = async (
  blog: BlogItem,
  token?: string,
) => {
  if (!hasConvexUrl()) {
    return;
  }

  const authToken = token || (await getConvexAuthToken());

  await fetchMutation(
    markBlogPublishedMutation,
    {
      blogId: castBlogId(blog.id),
      productId: blog.productId ? castProductId(blog.productId) : undefined,
    },
    { token: authToken },
  );
};
