import { fetchMutation } from "convex/nextjs";
import { getConvexAuthToken } from "../auth/getConvexAuthToken";
import { updateBlogContentForRouteMutation } from "./references/updateBlogContentForRouteMutation";
import { updateBlogContentMutation } from "./references/updateBlogContentMutation";
import type { Id } from "../../../convex/_generated/dataModel";

type UpdateRouteBlogContentOptions = {
  blogId: Id<"blogs">;
  excerpt: string;
  mdx: string;
  title: string;
  userId: string;
};

export const updateRouteBlogContent = async ({
  blogId,
  excerpt,
  mdx,
  title,
  userId,
}: UpdateRouteBlogContentOptions) => {
  try {
    const token = await getConvexAuthToken();

    if (token) {
      await fetchMutation(
        updateBlogContentMutation,
        {
          blogId,
          excerpt,
          mdx,
          title,
        },
        { token },
      );
      return;
    }
  } catch {
    // Fall back to the route-authenticated mutation below.
  }

  await fetchMutation(updateBlogContentForRouteMutation, {
    blogId,
    excerpt,
    mdx,
    title,
    userId,
  });
};
