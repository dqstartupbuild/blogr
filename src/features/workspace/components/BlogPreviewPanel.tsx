import Image from "next/image";
import { Download, Edit3 } from "lucide-react";
import { SecondaryAnchor } from "./SecondaryAnchor";
import { SectionTitle } from "./SectionTitle";
import type { BlogItem } from "../types/BlogItem";

type BlogPreviewPanelProps = {
  blog?: BlogItem;
};

export const BlogPreviewPanel = ({ blog }: BlogPreviewPanelProps) => {
  if (!blog) {
    return (
      <aside className="rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm">
        <SectionTitle title="Preview" />
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm xl:sticky xl:top-5 xl:self-start">
      <SectionTitle
        action={
          <div className="flex gap-2">
            <SecondaryAnchor href={`/blogs/${blog.id}`}>
              <Edit3 size={16} aria-hidden="true" />
              Edit
            </SecondaryAnchor>
            <SecondaryAnchor href={`/api/blogs/${blog.id}/download`}>
              <Download size={16} aria-hidden="true" />
              Zip
            </SecondaryAnchor>
          </div>
        }
        title="Preview"
      />
      {blog.featureImageUrl ? (
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-md">
          <Image alt="" fill src={blog.featureImageUrl} className="object-cover" />
        </div>
      ) : null}
      <h3 className="mt-4 text-xl font-semibold leading-7 text-[#1d2320]">
        {blog.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#66736b]">{blog.excerpt}</p>
      <div className="mt-4 max-h-[420px] overflow-auto rounded-md border border-[#e6e0d4] bg-white p-4 font-mono text-xs leading-5 text-[#324039]">
        <pre className="whitespace-pre-wrap">{blog.mdx}</pre>
      </div>
    </aside>
  );
};
