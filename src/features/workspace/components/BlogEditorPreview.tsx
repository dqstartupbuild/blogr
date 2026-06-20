import { MarkdownPreview } from "./MarkdownPreview";
import type { BlogEditorState } from "../types/BlogEditorState";

type BlogEditorPreviewProps = {
  state: BlogEditorState;
};

export const BlogEditorPreview = ({ state }: BlogEditorPreviewProps) => {
  return (
    <aside className="rounded-lg border border-black bg-white p-4 lg:sticky lg:top-5 lg:self-start">
      <h2 className="text-lg font-semibold text-black">Preview</h2>
      <h3 className="mt-4 text-xl font-semibold leading-7 text-black">
        {state.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-black">{state.excerpt}</p>
      <div className="mt-4 max-h-[620px] overflow-auto rounded-md border border-black bg-white p-4">
        <MarkdownPreview mdx={state.mdx} />
      </div>
    </aside>
  );
};
