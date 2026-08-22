import { runReplicateText } from "../replicate/runReplicateText";
import { buildBlogWriterPrompt } from "./buildBlogWriterPrompt";
import { createFallbackMdx } from "./createFallbackMdx";
import { insertMissingYoutubeVideos } from "./insertMissingYoutubeVideos";
import { normalizeBlogMdxImages } from "./normalizeBlogMdxImages";
import { normalizeMetaDescription } from "./normalizeMetaDescription";
import { normalizeSeoTitle } from "./normalizeSeoTitle";
import { normalizeYoutubeLinksInMdx } from "./normalizeYoutubeLinksInMdx";
import { parseWriterDraft } from "./parseWriterDraft";
import { slugify } from "./slugify";
import { buildBlogTags } from "./tags/buildBlogTags";
import type { BlogImage } from "./types/BlogImage";
import type { GeneratedBlog } from "./types/GeneratedBlog";
import type { ResearchSource } from "./types/ResearchSource";
import type { StoredProduct } from "./types/StoredProduct";
import type { AssociateBrandLink } from "@/features/workspace/types/AssociateBrandLink";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { LinkItem } from "@/features/workspace/types/LinkItem";

type WriteBlogDraftOptions = {
  associateBrandLinks: AssociateBrandLink[];
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  productRagContext: string;
  settings: BlogGenerationSettings;
  sourceText?: string;
  sources: ResearchSource[];
  sourceLinks: LinkItem[];
  topicBrief?: string;
  youtubeVideos: LinkItem[];
};

export const writeBlogDraft = async ({
  associateBrandLinks,
  images,
  internalLinks,
  keyword,
  product,
  productRagContext,
  settings,
  sourceText,
  sources,
  sourceLinks,
  topicBrief,
  youtubeVideos,
}: WriteBlogDraftOptions): Promise<GeneratedBlog> => {
  const prompt = buildBlogWriterPrompt({
    associateBrandLinks,
    images,
    internalLinks,
    keyword,
    product,
    productRagContext,
    settings,
    sourceText,
    sources,
    topicBrief,
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
  const seoTitle = normalizeSeoTitle({
    keyword,
    productName: product.name,
    seoTitle: draft.seoTitle,
    title,
  });
  const excerpt = normalizeMetaDescription({
    description: draft.excerpt,
    keyword,
    productName: product.name,
  });
  const slug = draft.slug ? slugify(draft.slug) : slugify(title);
  const rawMdx =
    draft.mdx ||
    createFallbackMdx({
      associateBrandLinks,
      description: excerpt,
      images,
      internalLinks,
      keyword,
      product,
      seoTitle,
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
    excerpt,
    featureImageUrl: images[0]?.url,
    images,
    internalLinks,
    keyword,
    mdx,
    seoTitle,
    slug,
    sources: sourceLinks,
    status: "ready",
    tags: buildBlogTags({
      excerpt,
      keyword,
      seoTitle,
      title,
      topicBrief,
    }),
    title,
    youtubeVideos,
  };
};
