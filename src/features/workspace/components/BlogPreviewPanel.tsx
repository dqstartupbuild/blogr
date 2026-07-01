import { Clock, Edit3 } from "lucide-react";
import { ArticleDateSummary } from "./ArticleDateSummary";
import { ArticleStatsPanel } from "./ArticleStatsPanel";
import { ArticleStatusPanel } from "./ArticleStatusPanel";
import { BlogPublishButton } from "./BlogPublishButton";
import { BlogZipButton } from "./BlogZipButton";
import { DeleteActionButton } from "./DeleteActionButton";
import { MarkdownPreview } from "./MarkdownPreview";
import { RegenerateableFeatureImage } from "./RegenerateableFeatureImage";
import { SecondaryAnchor } from "./SecondaryAnchor";
import { StatusBadge } from "./StatusBadge";
import { countBlogWords } from "../utils/countBlogWords";
import { estimateReadTimeMinutes } from "../utils/estimateReadTimeMinutes";
import { formatCountLabel } from "../utils/formatCountLabel";
import type { BlogItem } from "../types/BlogItem";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";

type BlogPreviewPanelProps = {
  blog?: BlogItem;
  deleteBlog?: DeleteBlog;
  onBlogDeleted?: () => void;
  regenerateImage?: RegenerateBlogImage;
  variant?: "card" | "drawer";
};

export const BlogPreviewPanel = ({
  blog,
  deleteBlog,
  onBlogDeleted,
  regenerateImage,
  variant = "card",
}: BlogPreviewPanelProps) => {
  const sectionClassName =
    variant === "drawer"
      ? "bg-white"
      : "rounded-lg border border-black/10 bg-white p-5 shadow-sm";
  const markdownClassName =
    variant === "drawer"
      ? "mt-6 rounded-lg border border-black/10 bg-white p-4"
      : "mt-6 max-h-[520px] overflow-auto rounded-lg border border-black/10 bg-white p-4";

  if (!blog) {
    return (
      <section className={sectionClassName}>
        <h2 className="text-lg font-semibold text-black">Preview</h2>
        <p className="mt-3 text-sm leading-6 text-black">
          Choose a blog to preview it here.
        </p>
      </section>
    );
  }

  const wordCount = countBlogWords(blog.mdx);
  const readTime = estimateReadTimeMinutes(wordCount);

  return (
    <section className={sectionClassName}>
      <div className="flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black/60">Preview</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-black">
            {blog.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-black/60">
            <StatusBadge status={blog.status} />
            <ArticleDateSummary
              blog={blog}
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/60"
            />
            <span>{formatCountLabel(wordCount, "word")}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} aria-hidden="true" />
              {readTime} min read
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <SecondaryAnchor href={`/blogs/${blog.id}`}>
            <Edit3 size={16} aria-hidden="true" />
            Edit
          </SecondaryAnchor>
          <BlogPublishButton blog={blog} />
          <BlogZipButton blog={blog} />
          {deleteBlog ? (
            <DeleteActionButton
              confirmMessage="Delete this article? This cannot be undone."
              label="Delete"
              onDelete={async () => {
                await deleteBlog(blog.id);
                onBlogDeleted?.();
              }}
            />
          ) : null}
        </div>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h3 className="text-3xl font-semibold leading-tight text-black">
            {blog.title}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-black/65">
            {blog.excerpt}
          </p>
          {blog.featureImageUrl ? (
            <RegenerateableFeatureImage
              alt={blog.title}
              blogId={blog.id}
              imageIndex={0}
              prompt={blog.images[0]?.prompt}
              regenerateImage={regenerateImage}
              src={blog.featureImageUrl}
            />
          ) : null}
          <div className={markdownClassName}>
            <MarkdownPreview
              blogId={blog.id}
              images={blog.images}
              mdx={blog.mdx}
              regenerateImage={regenerateImage}
            />
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <ArticleStatusPanel blog={blog} />
          <ArticleStatsPanel blog={blog} />
        </aside>
      </div>
    </section>
  );
};
