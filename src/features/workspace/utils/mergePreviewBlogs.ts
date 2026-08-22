import type { BlogItem } from "../types/BlogItem";

type MergePreviewBlogsOptions = {
  currentPageBlogs: BlogItem[];
  recentBlogs?: BlogItem[];
  selectedBlog?: BlogItem;
};

export const mergePreviewBlogs = ({
  currentPageBlogs,
  recentBlogs = [],
  selectedBlog,
}: MergePreviewBlogsOptions) => {
  const blogIds = new Set<string>();

  return [selectedBlog, ...currentPageBlogs, ...recentBlogs].filter(
    (blog): blog is BlogItem => {
      if (!blog || blogIds.has(blog.id)) {
        return false;
      }

      blogIds.add(blog.id);
      return true;
    },
  );
};
