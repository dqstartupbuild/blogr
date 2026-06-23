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
};

export const BlogPreviewPanel = ({ blog }: BlogPreviewPanelProps) => {
  if (!blog) {
    return (
      <aside className="rounded-lg border border-black bg-white p-4">
        <SectionTitle title="Preview" />
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-black bg-white p-4 xl:sticky xl:top-5 xl:self-start">
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
      <div className="mt-4 max-h-[420px] overflow-auto rounded-md border border-black bg-white p-4">
        <MarkdownPreview mdx={blog.mdx} />
      </div>
    </aside>
  );
};
