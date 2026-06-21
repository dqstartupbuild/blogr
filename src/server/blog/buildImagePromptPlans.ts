import { getImagesPerArticleCount } from "./getImagesPerArticleCount";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";

export const buildImagePromptPlans = (settings: BlogGenerationSettings) => {
  const imageCount = getImagesPerArticleCount(settings.imagesPerArticle);
  const earlyScene = settings.includeInfographics
    ? "a clean infographic-style visual with simple shapes, arrows, icons, and data-like structure that explains the core idea without small unreadable details"
    : "a clear supporting editorial scene that explains the core idea in a simple, beginner-friendly way";

  return [
    {
      imageJob: "Feature image for the top of the post",
      scene:
        "a polished editorial hero scene that shows the main situation behind the keyword and feels tied to the product category",
    },
    {
      imageJob: settings.includeInfographics
        ? "Supporting infographic for an early section"
        : "Supporting image for an early section",
      scene: earlyScene,
    },
    {
      imageJob: "Supporting image for a practical how-to section",
      scene:
        "a step-by-step work moment with a person organizing the next action in a beginner-friendly way",
    },
    {
      imageJob: "Supporting image for a later outcome section",
      scene:
        "the reader after making progress, with a calmer and clearer version of the same product-related situation",
    },
    {
      imageJob: settings.includeInfographics
        ? "Supporting comparison infographic"
        : "Supporting comparison image",
      scene:
        "a side-by-side comparison scene that makes tradeoffs easy to understand without clutter",
    },
  ].slice(0, imageCount);
};
