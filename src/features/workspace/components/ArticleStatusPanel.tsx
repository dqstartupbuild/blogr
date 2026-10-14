import { ArticleDateSummary } from "./ArticleDateSummary";
import { StatusBadge } from "./StatusBadge";
import type { BlogItem } from "../types/BlogItem";

type ArticleStatusPanelProps = {
  blog: BlogItem;
};

export const ArticleStatusPanel = ({ blog }: ArticleStatusPanelProps) => {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-black">Article Status</h2>
      <div className="mt-4">
        <StatusBadge status={blog.status} />
      </div>
      <ArticleDateSummary blog={blog} className="mt-4 grid gap-1 text-sm leading-6 text-black/60" />
    </section>
  );
};
