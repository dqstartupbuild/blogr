import { buildBlogImagePrompt } from "./buildBlogImagePrompt";
import type { StoredProduct } from "./types/StoredProduct";

type BuildImagePromptsOptions = {
  keyword: string;
  product: StoredProduct;
};

export const buildImagePrompts = ({
  keyword,
  product,
}: BuildImagePromptsOptions) => {
  return [
    {
      alt: `${keyword} feature image`,
      prompt: buildBlogImagePrompt({
        imageJob: "Feature image for the top of the post",
        keyword,
        product,
        scene:
          "a polished editorial hero scene that shows the main situation behind the keyword and feels tied to the product category",
      }),
      role: "feature" as const,
    },
    {
      alt: `${keyword} simple infographic`,
      prompt: buildBlogImagePrompt({
        imageJob: "Supporting image for an early section",
        keyword,
        product,
        scene:
          "a clean infographic-style visual with simple shapes, arrows, and icons that explain the core idea without any readable words",
      }),
      role: "supporting" as const,
    },
    {
      alt: `${keyword} step by step`,
      prompt: buildBlogImagePrompt({
        imageJob: "Supporting image for a practical how-to section",
        keyword,
        product,
        scene:
          "a realistic step-by-step work moment with a person organizing the next action in a beginner-friendly way",
      }),
      role: "supporting" as const,
    },
    {
      alt: `${keyword} outcome`,
      prompt: buildBlogImagePrompt({
        imageJob: "Supporting image for a later outcome section",
        keyword,
        product,
        scene:
          "the reader after making progress, with a calmer and clearer version of the same product-related situation",
      }),
      role: "supporting" as const,
    },
  ];
};
