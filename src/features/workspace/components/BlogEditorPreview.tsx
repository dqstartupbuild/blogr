import { ArticleStatsPanel } from "./ArticleStatsPanel";
import { MarkdownPreview } from "./MarkdownPreview";
import type { BlogItem } from "../types/BlogItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type BlogEditorPreviewProps = {
  blog: BlogItem;
  regenerateImage?: RegenerateBlogImage;
  updateBlogImages?: UpdateBlogImages;
};

export const BlogEditorPreview = ({
  blog,
  regenerateImage,
  updateBlogImages,
}: BlogEditorPreviewProps) => {
  return (
    <aside className="grid min-w-0 gap-4 xl:sticky xl:top-6 xl:self-start">
      <section className="min-w-0 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Preview</h2>
        <h3 className="mt-4 [overflow-wrap:anywhere] text-xl font-semibold leading-7 text-black">
          {blog.title}
        </h3>
        <p className="mt-2 [overflow-wrap:anywhere] text-sm leading-6 text-black/65">
          {blog.excerpt}
        </p>
        <div className="mt-4 min-w-0 max-w-full max-h-[620px] overflow-auto rounded-lg border border-black/10 bg-white p-4">
          <MarkdownPreview
            blogId={blog.id}
            images={blog.images}
            mdx={blog.mdx}
            regenerateImage={regenerateImage}
            title={blog.title}
            updateBlogImages={updateBlogImages}
          />
        </div>
      </section>
      <ArticleStatsPanel blog={blog} />
    </aside>
  );
};
