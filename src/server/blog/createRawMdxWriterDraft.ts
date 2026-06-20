import { stripMarkdownCodeFence } from "./stripMarkdownCodeFence";
import type { WriterDraft } from "./types/WriterDraft";

export const createRawMdxWriterDraft = (text: string): WriterDraft => {
  return { mdx: stripMarkdownCodeFence(text) };
};
