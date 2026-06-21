import { buildSourceLinks } from "./buildSourceLinks";
import { chooseInternalLinks } from "./chooseInternalLinks";
import { applyBlogImagesToMdx } from "./applyBlogImagesToMdx";
import { findYoutubeVideos } from "./findYoutubeVideos";
import { generateBlogImages } from "./generateBlogImages";
import { planBlogImagePrompts } from "./planBlogImagePrompts";
import { runBlogResearch } from "./runBlogResearch";
import { storeGeneratedBlogImages } from "./storeGeneratedBlogImages";
import { writeBlogDraft } from "./writeBlogDraft";
import { normalizeBlogGenerationSettings } from "@/features/workspace/utils/normalizeBlogGenerationSettings";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import { searchProductRagContext } from "../rag/searchProductRagContext";
import type { GeneratedBlog } from "./types/GeneratedBlog";
import type { StoredProduct } from "./types/StoredProduct";

type GenerateBlogForKeywordOptions = {
  blogGenerationSettings?: BlogGenerationSettings;
  convexAuthToken?: string;
  keyword: string;
  product: StoredProduct;
  productId?: string;
  userId?: string;
};

export const generateBlogForKeyword = async ({
  blogGenerationSettings,
  convexAuthToken,
  keyword,
  product,
  productId,
  userId,
}: GenerateBlogForKeywordOptions): Promise<GeneratedBlog> => {
  const settings = normalizeBlogGenerationSettings(
    blogGenerationSettings || product.blogGenerationSettings,
  );
  const [sources, youtubeVideos, productRagContext] = await Promise.all([
    runBlogResearch(keyword),
    settings.youtubeVideo ? findYoutubeVideos(keyword) : Promise.resolve([]),
    searchProductRagContext({
      productId,
      query: keyword,
      token: convexAuthToken,
    }),
  ]);
  const internalLinks = chooseInternalLinks({
    keyword,
    links: product.siteLinks || [],
    limit: settings.internalLinksPerArticle,
  });
  const sourceLinks = buildSourceLinks(sources);
  const textBlog = await writeBlogDraft({
    images: [],
    internalLinks,
    keyword,
    product,
    productRagContext,
    settings,
    sourceLinks,
    sources,
    youtubeVideos,
  });
  const imagePrompts = await planBlogImagePrompts({
    keyword,
    mdx: textBlog.mdx,
    product,
    settings,
    title: textBlog.title,
  });
  const images = await generateBlogImages({
    prompts: imagePrompts,
  });
  const storedImages = await storeGeneratedBlogImages({
    images,
    token: convexAuthToken,
    userId,
  });
  const mdx = applyBlogImagesToMdx({
    images: storedImages,
    mdx: textBlog.mdx,
  });

  return {
    ...textBlog,
    featureImageUrl: storedImages[0]?.url,
    images: storedImages,
    mdx,
  };
};
