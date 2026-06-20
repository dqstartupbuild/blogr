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
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor="blog-mdx">
      <span>MDX</span>
      <textarea
        className="min-h-[560px] rounded-md border border-black bg-white px-3 py-3 font-mono text-sm leading-6 text-black outline-none transition placeholder:text-black focus:border-black"
        id="blog-mdx"
        onChange={(event) => updateMdx(event.target.value)}
        spellCheck={false}
        value={mdx}
      />
    </label>
  );
};
