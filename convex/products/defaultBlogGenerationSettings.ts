export const defaultBlogGenerationSettings = {
  articleStyle: "Informative",
  associateBrandLinks: [] as {
    description: string;
    title: string;
    url: string;
  }[],
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
} as const;
