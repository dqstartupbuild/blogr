import { z } from "zod";
import { articleStyleValues } from "@/features/workspace/constants/articleStyleValues";
import { imageStyleValues } from "@/features/workspace/constants/imageStyleValues";
import { imagesPerArticleValues } from "@/features/workspace/constants/imagesPerArticleValues";

export const blogGenerationSettingsSchema = z.object({
  articleStyle: z.enum(articleStyleValues),
  globalArticleInstructions: z.string(),
  internalLinksPerArticle: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  imageStyle: z.enum(imageStyleValues),
  imagesPerArticle: z.enum(imagesPerArticleValues),
  tableOfContents: z.boolean(),
  youtubeVideo: z.boolean(),
  callToAction: z.boolean(),
  includeInfographics: z.boolean(),
  mentionSimilarProducts: z.boolean(),
  firstPersonWriting: z.boolean(),
});
