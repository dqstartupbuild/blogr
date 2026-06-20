"use client";

type BlogMdxTextareaProps = {
  mdx: string;
  updateMdx: (value: string) => void;
};

export const BlogMdxTextarea = ({
  mdx,
  updateMdx,
}: BlogMdxTextareaProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#324039]" htmlFor="blog-mdx">
      <span>MDX</span>
      <textarea
        className="min-h-[560px] rounded-md border border-[#cfc7b8] bg-white px-3 py-3 font-mono text-sm leading-6 outline-none transition placeholder:text-[#8b938e] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15"
        id="blog-mdx"
        onChange={(event) => updateMdx(event.target.value)}
        spellCheck={false}
        value={mdx}
      />
    </label>
  );
};
