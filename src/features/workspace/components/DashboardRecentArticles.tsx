import Link from "next/link";
import { DashboardRecentArticleRow } from "./DashboardRecentArticleRow";
import { EmptyState } from "./EmptyState";
import type { BlogItem } from "../types/BlogItem";

type DashboardRecentArticlesProps = {
  blogs: BlogItem[];
  previewBlog: (blogId: string) => void;
};

export const DashboardRecentArticles = ({
  blogs,
  previewBlog,
}: DashboardRecentArticlesProps) => {
  const recentBlogs = blogs.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <h2 className="text-base font-semibold text-black">Recent Articles</h2>
        <Link className="text-sm font-semibold text-black" href="/blogs">
          View all
        </Link>
      </div>
      {recentBlogs.length > 0 ? (
        recentBlogs.map((blog) => (
          <DashboardRecentArticleRow
            blog={blog}
            key={blog.id}
            previewBlog={previewBlog}
          />
        ))
      ) : (
        <div className="border-t border-black/10 p-4">
          <EmptyState label="No articles yet." />
        </div>
      )}
    </section>
  );
};
