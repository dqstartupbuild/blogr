import { countBlogHeadings } from "../utils/countBlogHeadings";
import { countBlogImages } from "../utils/countBlogImages";
import { countBlogWords } from "../utils/countBlogWords";
import { estimateReadTimeMinutes } from "../utils/estimateReadTimeMinutes";
import type { BlogItem } from "../types/BlogItem";

type ArticleStatsPanelProps = {
  blog: BlogItem;
};

export const ArticleStatsPanel = ({ blog }: ArticleStatsPanelProps) => {
  const words = blog.wordCount ?? countBlogWords(blog.mdx);
  const headings = countBlogHeadings(blog.mdx);
  const images = countBlogImages(blog);
  const readTime = estimateReadTimeMinutes(words);

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-black">Article Stats</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-black/60">Words</dt>
          <dd className="font-semibold text-black">{words.toLocaleString()}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-black/60">Headings</dt>
          <dd className="font-semibold text-black">
            {headings.toLocaleString()}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-black/60">Images</dt>
          <dd className="font-semibold text-black">{images.toLocaleString()}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-black/60">Read time</dt>
          <dd className="font-semibold text-black">{readTime} min</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-black/60">Internal links</dt>
          <dd className="font-semibold text-black">
            {blog.internalLinks.length.toLocaleString()}
          </dd>
        </div>
      </dl>
    </section>
  );
};
