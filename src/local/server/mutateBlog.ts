import type { LocalState } from "../domain/LocalState";
import { upsertGeneratedBlog } from "./actions/upsertGeneratedBlog";
import { deleteBlog } from "./actions/deleteBlog";
import { updateBlogContent } from "./actions/updateBlogContent";
import { updateBlogImages } from "./actions/updateBlogImages";
import { markBlogPublished } from "./actions/markBlogPublished";

export const mutateBlog = (state: LocalState, name: string, args: Record<string, unknown>): unknown => {
  switch (name) {
    case "upsertGeneratedBlogMutation": return upsertGeneratedBlog(state, args);
    case "deleteBlogMutation": return deleteBlog(state, args);
    case "updateBlogContentMutation": return updateBlogContent(state, args);
    case "updateBlogImagesMutation": return updateBlogImages(state, args, false);
    case "updateBlogImageMutation": return updateBlogImages(state, args, true);
    case "markBlogPublishedMutation": return markBlogPublished(state, args);
    default: throw new Error(`Unknown article change: ${name}`);
  }
};
