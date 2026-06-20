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
          "the reader facing the main situation behind the keyword, with the product category quietly shaping the setting",
      }),
    },
    {
      alt: `${keyword} planning example`,
      prompt: buildBlogImagePrompt({
        imageJob: "In-post image showing the common problem",
        keyword,
        product,
        scene:
          "a simple work moment where the reader can see the problem the keyword is trying to solve",
      }),
    },
    {
      alt: `${keyword} step by step`,
      prompt: buildBlogImagePrompt({
        imageJob: "In-post image showing the practical process",
        keyword,
        product,
        scene:
          "a realistic step-by-step moment with a person organizing the next action in a beginner-friendly way",
      }),
    },
    {
      alt: `${keyword} outcome`,
      prompt: buildBlogImagePrompt({
        imageJob: "In-post image showing the better outcome",
        keyword,
        product,
        scene:
          "the reader after making progress, with a calmer and clearer version of the same product-related situation",
      }),
    },
  ];
};
