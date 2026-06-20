import { buildSourceLinks } from "./buildSourceLinks";
import { chooseInternalLinks } from "./chooseInternalLinks";
import { findYoutubeVideos } from "./findYoutubeVideos";
import { generateBlogImages } from "./generateBlogImages";
import { runBlogResearch } from "./runBlogResearch";
import { writeBlogDraft } from "./writeBlogDraft";
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
  const [sources, youtubeVideos, images] = await Promise.all([
    runBlogResearch(keyword),
    findYoutubeVideos(keyword),
    generateBlogImages({ keyword, product }),
  ]);
  const internalLinks = chooseInternalLinks({
    keyword,
    links: product.siteLinks || [],
  });
  const sourceLinks = buildSourceLinks(sources);

  return await writeBlogDraft({
    images,
    internalLinks,
    keyword,
    product,
    sourceLinks,
    sources,
    youtubeVideos,
  });
};
