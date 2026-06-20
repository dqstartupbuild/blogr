import type { WriterDraft } from "./types/WriterDraft";

export const parseWriterDraft = (text: string): WriterDraft => {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    return { mdx: trimmed };
  }

  return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as WriterDraft;
};
