import type { ImagesPerArticle } from "@/features/workspace/types/ImagesPerArticle";

export const getImagesPerArticleCount = (
  imagesPerArticle: ImagesPerArticle,
) => {
  switch (imagesPerArticle) {
    case "None":
      return 0;
    case "Feature Only":
      return 1;
    case "Feature +2":
      return 3;
    case "Feature +4":
      return 5;
    case "Feature +3":
    default:
      return 4;
  }
};
