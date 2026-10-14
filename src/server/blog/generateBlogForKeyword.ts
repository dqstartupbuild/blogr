import { buildSourceLinks } from "./buildSourceLinks";
import { chooseInternalLinks } from "./chooseInternalLinks";
import { applyBlogImagesToMdx } from "./applyBlogImagesToMdx";
import { findYoutubeVideos } from "./findYoutubeVideos";
import { generateBlogImages } from "./generateBlogImages";
import { getBlogFeatureImage } from "./getBlogFeatureImage";
import { normalizeBlogKeyword } from "./normalizeBlogKeyword";
import { planBlogImagePrompts } from "./planBlogImagePrompts";
import { runBlogResearch } from "./runBlogResearch";
import { storeGeneratedBlogImages } from "./storeGeneratedBlogImages";
import { writeBlogDraft } from "./writeBlogDraft";
import { normalizeBlogGenerationSettings } from "@/features/workspace/utils/normalizeBlogGenerationSettings";
import { filterActiveLinks } from "@/features/workspace/utils/filterActiveLinks";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { GeneratedBlog } from "./types/GeneratedBlog";
import type { StoredProduct } from "./types/StoredProduct";

type GenerateBlogForKeywordOptions = {
  blogGenerationSettings?: BlogGenerationSettings;
  keyword: string;
  product: StoredProduct;
  productId?: string;
  sourceText?: string;
  topicBrief?: string;
};

export const generateBlogForKeyword = async ({
  blogGenerationSettings,
  keyword,
  product,
  sourceText,
  topicBrief,
}: GenerateBlogForKeywordOptions): Promise<GeneratedBlog> => {
  const normalizedKeyword = normalizeBlogKeyword(keyword) || keyword.trim();
  const settings = normalizeBlogGenerationSettings(
    blogGenerationSettings || product.blogGenerationSettings,
  );
  const [sources, youtubeVideos] = await Promise.all([
    runBlogResearch(normalizedKeyword),
    settings.youtubeVideo
      ? findYoutubeVideos(normalizedKeyword)
      : Promise.resolve([]),
  ]);
  const activeSiteLinks = filterActiveLinks(product.siteLinks || []);
  const internalLinks = chooseInternalLinks({
    keyword: normalizedKeyword,
    links: activeSiteLinks,
    limit: settings.internalLinksPerArticle,
  });
  const sourceLinks = buildSourceLinks(sources);
  const textBlog = await writeBlogDraft({
    associateBrandLinks: settings.associateBrandLinks,
    images: [],
    internalLinks,
    keyword: normalizedKeyword,
    product,
    productRagContext: "",
    settings,
    sourceText,
    topicBrief,
    sourceLinks,
    sources,
    youtubeVideos,
  });
  const imagePrompts = await planBlogImagePrompts({
    keyword: normalizedKeyword,
    mdx: textBlog.mdx,
    product,
    settings,
    title: textBlog.title,
  });
  const images = await generateBlogImages({
    prompts: imagePrompts,
  });
  const storedImages = await storeGeneratedBlogImages({ images });
  const mdx = applyBlogImagesToMdx({
    images: storedImages,
    mdx: textBlog.mdx,
  });
  const featureImage = getBlogFeatureImage(storedImages);

  return {
    ...textBlog,
    featureImageUrl: featureImage?.url,
    images: storedImages,
    mdx,
  };
};
