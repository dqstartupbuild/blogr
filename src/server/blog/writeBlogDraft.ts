import { runReplicateText } from "../replicate/runReplicateText";
import { buildBlogWriterPrompt } from "./buildBlogWriterPrompt";
import { createFallbackMdx } from "./createFallbackMdx";
import { insertMissingYoutubeVideos } from "./insertMissingYoutubeVideos";
import { normalizeBlogMdxImages } from "./normalizeBlogMdxImages";
import { normalizeYoutubeLinksInMdx } from "./normalizeYoutubeLinksInMdx";
import { parseWriterDraft } from "./parseWriterDraft";
import { slugify } from "./slugify";
import type { BlogImage } from "./types/BlogImage";
import type { GeneratedBlog } from "./types/GeneratedBlog";
import type { ResearchSource } from "./types/ResearchSource";
import type { StoredProduct } from "./types/StoredProduct";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { LinkItem } from "@/features/workspace/types/LinkItem";

type WriteBlogDraftOptions = {
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  productRagContext: string;
  settings: BlogGenerationSettings;
  sourceText?: string;
  sources: ResearchSource[];
  sourceLinks: LinkItem[];
  youtubeVideos: LinkItem[];
};

export const writeBlogDraft = async ({
  images,
  internalLinks,
  keyword,
  product,
  productRagContext,
  settings,
  sourceText,
  sources,
  sourceLinks,
  youtubeVideos,
}: WriteBlogDraftOptions): Promise<GeneratedBlog> => {
  const prompt = buildBlogWriterPrompt({
    images,
    internalLinks,
    keyword,
    product,
    productRagContext,
    settings,
    sourceText,
    sources,
    youtubeVideos,
  });
  const text = await runReplicateText({
    maxTokens: 12000,
    prompt,
    systemPrompt:
      "You are a longform blog writer. You write plainly, with warmth, proof, useful examples, and no filler. Return XML only.",
  });
  const draft = parseWriterDraft(text);
  const title = draft.title || `A Simple Guide to ${keyword}`;
  const slug = draft.slug ? slugify(draft.slug) : slugify(title);
  const rawMdx =
    draft.mdx ||
    createFallbackMdx({
      images,
      internalLinks,
      keyword,
      product,
      settings,
      sources: sourceLinks,
      title,
      youtubeVideos,
    });
  const imageMdx = normalizeBlogMdxImages({
    images,
    mdx: rawMdx,
  });
  const videoMdx =
    youtubeVideos.length > 0 ? normalizeYoutubeLinksInMdx(imageMdx) : imageMdx;
  const mdx = insertMissingYoutubeVideos({
    mdx: videoMdx,
    youtubeVideos,
  });

  return {
    excerpt: draft.excerpt || `A clear guide to ${keyword}.`,
    featureImageUrl: images[0]?.url,
    images,
    internalLinks,
    keyword,
    mdx,
    slug,
    sources: sourceLinks,
    status: "ready",
    title,
    youtubeVideos,
  };
};
