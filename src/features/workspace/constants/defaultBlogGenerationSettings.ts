import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";

export const defaultBlogGenerationSettings: BlogGenerationSettings = {
  articleStyle: "Informative",
  globalArticleInstructions: "",
  internalLinksPerArticle: 5,
  imageStyle: "Realistic",
  imagesPerArticle: "Feature +3",
  tableOfContents: false,
  youtubeVideo: true,
  callToAction: true,
  includeInfographics: false,
  mentionSimilarProducts: false,
  firstPersonWriting: false,
};
