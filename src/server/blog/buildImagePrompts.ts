import type { StoredProduct } from "./types/StoredProduct";

type BuildImagePromptsOptions = {
  keyword: string;
  product: StoredProduct;
};

export const buildImagePrompts = ({
  keyword,
  product,
}: BuildImagePromptsOptions) => {
  const context = `${product.name}, ${product.niche}, ${product.audience}`;

  return [
    {
      alt: `${keyword} feature image`,
      prompt: `A clean editorial feature image for a long blog post about "${keyword}". Product context: ${context}. Use only pure black (#000000) and pure white (#ffffff). No gray, no color, no text in the image.`,
    },
    {
      alt: `${keyword} planning example`,
      prompt: `A simple scene showing the main idea behind "${keyword}" in a relatable work setting. Product context: ${context}. Use only pure black (#000000) and pure white (#ffffff). No visible words.`,
    },
    {
      alt: `${keyword} step by step`,
      prompt: `A clear visual metaphor for making progress one step at a time while learning "${keyword}". Product context: ${context}. Use only pure black (#000000) and pure white (#ffffff). No text, no logo.`,
    },
    {
      alt: `${keyword} outcome`,
      prompt: `A calm, human image showing the better outcome after applying advice about "${keyword}". Product context: ${context}. Use only pure black (#000000) and pure white (#ffffff). No text in image.`,
    },
  ];
};
