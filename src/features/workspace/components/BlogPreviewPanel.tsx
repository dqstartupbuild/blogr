import Image from "next/image";
import { Edit3 } from "lucide-react";
import { BlogPublishButton } from "./BlogPublishButton";
import { BlogZipButton } from "./BlogZipButton";
import { MarkdownPreview } from "./MarkdownPreview";
import { SecondaryAnchor } from "./SecondaryAnchor";
import { SectionTitle } from "./SectionTitle";
import type { BlogItem } from "../types/BlogItem";

type BlogPreviewPanelProps = {
  blog?: BlogItem;
  variant?: "card" | "drawer";
};

export const BlogPreviewPanel = ({
  blog,
  variant = "card",
}: BlogPreviewPanelProps) => {
  const sectionClassName =
    variant === "drawer"
      ? "bg-white"
      : "rounded-lg border border-black bg-white p-4";
  const markdownClassName =
    variant === "drawer"
      ? "mt-4 rounded-md border border-black bg-white p-4"
      : "mt-4 max-h-[420px] overflow-auto rounded-md border border-black bg-white p-4";

  if (!blog) {
    return (
      <section className={sectionClassName}>
        <SectionTitle title="Preview" />
        <p className="mt-3 text-sm leading-6 text-black">
          Choose a blog to preview it here.
        </p>
      </section>
    );
  }

  return (
    <section className={sectionClassName}>
      <SectionTitle
        action={
          <div className="flex gap-2">
            <SecondaryAnchor href={`/blogs/${blog.id}`}>
              <Edit3 size={16} aria-hidden="true" />
              Edit
            </SecondaryAnchor>
            <BlogPublishButton blog={blog} />
            <BlogZipButton blog={blog} />
          </div>
        }
        title="Preview"
      />
      {blog.featureImageUrl ? (
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-md">
          <Image alt="" fill src={blog.featureImageUrl} className="object-cover" />
        </div>
      ) : null}
      <h3 className="mt-4 text-xl font-semibold leading-7 text-black">
        {blog.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-black">{blog.excerpt}</p>
      <div className={markdownClassName}>
        <MarkdownPreview mdx={blog.mdx} />
      </div>
    </section>
  );
};
