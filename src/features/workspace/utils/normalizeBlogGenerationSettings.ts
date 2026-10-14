import { articleStyleValues } from "../constants/articleStyleValues";
import { defaultBlogGenerationSettings } from "../constants/defaultBlogGenerationSettings";
import { imageStyleValues } from "../constants/imageStyleValues";
import { imagesPerArticleValues } from "../constants/imagesPerArticleValues";
import { internalLinkCountOptions } from "../constants/internalLinkCountOptions";
import { normalizeAssociateBrandLinks } from "./normalizeAssociateBrandLinks";
import type { ArticleStyle } from "../types/ArticleStyle";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { ImageStyle } from "../types/ImageStyle";
import type { ImagesPerArticle } from "../types/ImagesPerArticle";
import type { InternalLinksPerArticle } from "../types/InternalLinksPerArticle";

type PartialBlogGenerationSettings = Partial<BlogGenerationSettings> | null;

export const normalizeBlogGenerationSettings = (
  settings: PartialBlogGenerationSettings | undefined,
): BlogGenerationSettings => {
  const rawArticleStyle = settings?.articleStyle;
  const rawImageStyle = settings?.imageStyle;
  const rawImagesPerArticle = settings?.imagesPerArticle;
  const rawInternalLinksPerArticle = settings?.internalLinksPerArticle;
  const articleStyle: ArticleStyle =
    rawArticleStyle &&
    articleStyleValues.includes(rawArticleStyle as ArticleStyle)
      ? rawArticleStyle
      : defaultBlogGenerationSettings.articleStyle;
  const imageStyle: ImageStyle =
    rawImageStyle && imageStyleValues.includes(rawImageStyle as ImageStyle)
      ? rawImageStyle
      : defaultBlogGenerationSettings.imageStyle;
  const imagesPerArticle: ImagesPerArticle =
    rawImagesPerArticle &&
    imagesPerArticleValues.includes(rawImagesPerArticle as ImagesPerArticle)
      ? rawImagesPerArticle
      : defaultBlogGenerationSettings.imagesPerArticle;
  const internalLinksPerArticle: InternalLinksPerArticle =
    rawInternalLinksPerArticle !== undefined &&
    internalLinkCountOptions.includes(
      rawInternalLinksPerArticle as InternalLinksPerArticle,
    )
      ? rawInternalLinksPerArticle
      : defaultBlogGenerationSettings.internalLinksPerArticle;

  return {
    ...defaultBlogGenerationSettings,
    ...settings,
    articleStyle,
    imageStyle,
    imagesPerArticle,
    internalLinksPerArticle,
    associateBrandLinks: normalizeAssociateBrandLinks(
      settings?.associateBrandLinks,
    ),
    globalArticleInstructions:
      settings?.globalArticleInstructions?.trim() ||
      defaultBlogGenerationSettings.globalArticleInstructions,
  };
};
