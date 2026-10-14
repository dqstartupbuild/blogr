import type { ImageStyle } from "@/features/workspace/types/ImageStyle";

export const buildBlogImageStyleDirection = (imageStyle: ImageStyle) => {
  switch (imageStyle) {
    case "Sketch":
      return "Use a hand-drawn pencil sketch style with natural texture, soft shading, and a clean editorial composition.";
    case "Illustration":
      return "Use a modern digital illustration style with clean lines, strong shapes, and vibrant but controlled color.";
    case "Brand & Text":
      return "Use a photo-realistic scene with the product's brand color as a clear background accent.";
    case "Title-Based":
      return "Use a polished feature-image style with brand colors and a layout that can hold a short title overlay. The visual treatment can be sketch, illustration, or realistic.";
    case "Realistic":
    default:
      return "Use a high-quality realistic photo style with dramatic but natural lighting and careful composition.";
  }
};
