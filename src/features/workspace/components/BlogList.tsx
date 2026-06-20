import { BlogRow } from "./BlogRow";
import { EmptyState } from "./EmptyState";
import type { BlogItem } from "../types/BlogItem";

type BlogListProps = {
  blogs: BlogItem[];
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogList = ({
  blogs,
  selectedBlogId,
  setSelectedBlogId,
}: BlogListProps) => {
  if (blogs.length === 0) {
    return <EmptyState label="No blogs yet." />;
  }

  return (
    <div className="mt-4 grid gap-3">
      {blogs.map((blog) => (
        <BlogRow
          blog={blog}
          isSelected={blog.id === selectedBlogId}
          key={blog.id}
          setSelectedBlogId={setSelectedBlogId}
        />
      ))}
    </div>
  );
};
