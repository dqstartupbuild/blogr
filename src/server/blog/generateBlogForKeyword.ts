import { buildSourceLinks } from "./buildSourceLinks";
import { chooseInternalLinks } from "./chooseInternalLinks";
import { findYoutubeVideos } from "./findYoutubeVideos";
import { generateBlogImages } from "./generateBlogImages";
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
  const [sources, youtubeVideos, images, productRagContext] = await Promise.all([
    runBlogResearch(keyword),
    settings.youtubeVideo ? findYoutubeVideos(keyword) : Promise.resolve([]),
    generateBlogImages({ keyword, product, settings }),
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
  const storedImages = await storeGeneratedBlogImages({
    images,
    token: convexAuthToken,
    userId,
  });

  return await writeBlogDraft({
    images: storedImages,
    internalLinks,
    keyword,
    product,
    productRagContext,
    settings,
    sourceLinks,
    sources,
    youtubeVideos,
  });
};
