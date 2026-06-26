import type { WriterDraft } from "./types/WriterDraft";

export const coerceWriterDraft = (value: unknown): WriterDraft | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const draft = value as Record<string, unknown>;

  return {
    excerpt: typeof draft.excerpt === "string" ? draft.excerpt : undefined,
    mdx: typeof draft.mdx === "string" ? draft.mdx : undefined,
    seoTitle: typeof draft.seoTitle === "string" ? draft.seoTitle : undefined,
    slug: typeof draft.slug === "string" ? draft.slug : undefined,
    title: typeof draft.title === "string" ? draft.title : undefined,
  };
};
