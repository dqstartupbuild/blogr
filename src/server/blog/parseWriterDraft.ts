import { createRawMdxWriterDraft } from "./createRawMdxWriterDraft";
import { parseWriterJsonDraft } from "./parseWriterJsonDraft";
import { parseWriterXmlDraft } from "./parseWriterXmlDraft";
import type { WriterDraft } from "./types/WriterDraft";

export const parseWriterDraft = (text: string): WriterDraft => {
  return (
    parseWriterXmlDraft(text) ||
    parseWriterJsonDraft(text) ||
    createRawMdxWriterDraft(text)
  );
};
