import type { ArticleStyle } from "./ArticleStyle";
import type { ImageStyle } from "./ImageStyle";
import type { ImagesPerArticle } from "./ImagesPerArticle";
import type { InternalLinksPerArticle } from "./InternalLinksPerArticle";

export type BlogGenerationSettings = {
  articleStyle: ArticleStyle;
  globalArticleInstructions: string;
  internalLinksPerArticle: InternalLinksPerArticle;
  imageStyle: ImageStyle;
  imagesPerArticle: ImagesPerArticle;
  tableOfContents: boolean;
  youtubeVideo: boolean;
  callToAction: boolean;
  includeInfographics: boolean;
  mentionSimilarProducts: boolean;
  firstPersonWriting: boolean;
};
