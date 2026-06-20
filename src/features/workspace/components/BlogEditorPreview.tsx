import type { BlogEditorState } from "../types/BlogEditorState";

type BlogEditorPreviewProps = {
  state: BlogEditorState;
};

export const BlogEditorPreview = ({ state }: BlogEditorPreviewProps) => {
  return (
    <aside className="rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm lg:sticky lg:top-5 lg:self-start">
      <h2 className="text-lg font-semibold text-[#1d2320]">Preview</h2>
      <h3 className="mt-4 text-xl font-semibold leading-7 text-[#1d2320]">
        {state.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#66736b]">{state.excerpt}</p>
      <div className="mt-4 max-h-[620px] overflow-auto rounded-md border border-[#e6e0d4] bg-white p-4 font-mono text-xs leading-5 text-[#324039]">
        <pre className="whitespace-pre-wrap">{state.mdx}</pre>
      </div>
    </aside>
  );
};
