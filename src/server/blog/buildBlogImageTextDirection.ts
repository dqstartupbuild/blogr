import type { ImageStyle } from "@/features/workspace/types/ImageStyle";

type BuildBlogImageTextDirectionOptions = {
  imageJob: string;
  imageStyle: ImageStyle;
};

export const buildBlogImageTextDirection = ({
  imageJob,
  imageStyle,
}: BuildBlogImageTextDirectionOptions) => {
  if (imageStyle === "Brand & Text") {
    return "Include short, clean text that matches the article topic. Keep it readable and avoid small UI text.";
  }

  if (imageStyle === "Title-Based" && imageJob.includes("Feature")) {
    return "Include a short title overlay based on the article topic, using the product's brand colors.";
  }

  return "Do not include readable text, fake UI text, captions, watermarks, random symbols, or unrelated objects.";
};
