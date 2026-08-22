import { buildBlogImageStyleDirection } from "./buildBlogImageStyleDirection";
import { buildBlogImageTextDirection } from "./buildBlogImageTextDirection";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";

export const buildImagePlannerStyleGuide = (settings: BlogGenerationSettings) => {
  return [
    buildBlogImageStyleDirection(settings.imageStyle),
    buildBlogImageTextDirection({
      imageJob: "Supporting article image",
      imageStyle: settings.imageStyle,
    }),
  ].join("\n");
};
