import { coerceWriterDraft } from "./coerceWriterDraft";
import { stripMarkdownCodeFence } from "./stripMarkdownCodeFence";
import type { WriterDraft } from "./types/WriterDraft";

export const parseWriterJsonDraft = (text: string): WriterDraft | null => {
  const trimmed = stripMarkdownCodeFence(text);
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  const candidates = [
    trimmed,
    jsonStart >= 0 && jsonEnd > jsonStart
      ? trimmed.slice(jsonStart, jsonEnd + 1)
      : "",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const draft = coerceWriterDraft(parsed);

      if (draft) return draft;
    } catch {
      // Try the next shape before giving up.
    }
  }

  return null;
};
