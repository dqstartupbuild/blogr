import { buildSourceLinks } from "./buildSourceLinks";
import { chooseInternalLinks } from "./chooseInternalLinks";
import { findYoutubeVideos } from "./findYoutubeVideos";
import { generateBlogImages } from "./generateBlogImages";
import { runBlogResearch } from "./runBlogResearch";
import { writeBlogDraft } from "./writeBlogDraft";
import { normalizeBlogGenerationSettings } from "@/features/workspace/utils/normalizeBlogGenerationSettings";
import type { GeneratedBlog } from "./types/GeneratedBlog";
import type { StoredProduct } from "./types/StoredProduct";

type GenerateBlogForKeywordOptions = {
  keyword: string;
  product: StoredProduct;
};

export const generateBlogForKeyword = async ({
  keyword,
  product,
}: GenerateBlogForKeywordOptions): Promise<GeneratedBlog> => {
  const settings = normalizeBlogGenerationSettings(
    product.blogGenerationSettings,
  );
  const [sources, youtubeVideos, images] = await Promise.all([
    runBlogResearch(keyword),
    settings.youtubeVideo ? findYoutubeVideos(keyword) : Promise.resolve([]),
    generateBlogImages({ keyword, product, settings }),
  ]);
  const internalLinks = chooseInternalLinks({
    keyword,
    links: product.siteLinks || [],
    limit: settings.internalLinksPerArticle,
  });
  const sourceLinks = buildSourceLinks(sources);

  return await writeBlogDraft({
    images,
    internalLinks,
    keyword,
    product,
    settings,
    sourceLinks,
    sources,
    youtubeVideos,
  });
};
