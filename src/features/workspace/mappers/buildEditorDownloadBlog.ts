import { safeClientFilename } from "../utils/safeClientFilename";
import type { BlogEditorState } from "../types/BlogEditorState";
import type { BlogItem } from "../types/BlogItem";

type BuildEditorDownloadBlogOptions = {
  baseBlog?: BlogItem;
  blogId: string;
  state: BlogEditorState;
};

export const buildEditorDownloadBlog = ({
  baseBlog,
  blogId,
  state,
}: BuildEditorDownloadBlogOptions): BlogItem => {
  return {
    ...baseBlog,
    excerpt: state.excerpt,
    id: baseBlog?.id || blogId,
    images: baseBlog?.images || [],
    internalLinks: baseBlog?.internalLinks || [],
    keyword: baseBlog?.keyword || "",
    mdx: state.mdx,
    slug: baseBlog?.slug || safeClientFilename(state.title),
    sources: baseBlog?.sources || [],
    status: "ready",
    title: state.title,
    updatedAt: baseBlog?.updatedAt || Date.now(),
    youtubeVideos: baseBlog?.youtubeVideos || [],
  };
};
