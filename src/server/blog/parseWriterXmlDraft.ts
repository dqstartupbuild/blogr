import { extractTaggedValue } from "./extractTaggedValue";
import { stripMarkdownCodeFence } from "./stripMarkdownCodeFence";
import type { WriterDraft } from "./types/WriterDraft";

export const parseWriterXmlDraft = (text: string): WriterDraft | null => {
  const trimmed = stripMarkdownCodeFence(text);
  const draft: WriterDraft = {
    excerpt: extractTaggedValue(trimmed, "excerpt"),
    mdx: extractTaggedValue(trimmed, "mdx"),
    slug: extractTaggedValue(trimmed, "slug"),
    title: extractTaggedValue(trimmed, "title"),
  };

  if (draft.title || draft.slug || draft.excerpt || draft.mdx) {
    return draft;
  }

  return null;
};
