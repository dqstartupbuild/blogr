import { buildImagePlannerStyleGuide } from "./buildImagePlannerStyleGuide";
import { buildProductVisualContext } from "./buildProductVisualContext";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { StoredProduct } from "./types/StoredProduct";

type BuildSectionSpecificImagePromptOptions = {
  imageJob: string;
  keyword: string;
  product: StoredProduct;
  sectionHeading: string;
  settings: BlogGenerationSettings;
};

export const buildSectionSpecificImagePrompt = ({
  imageJob,
  keyword,
  product,
  sectionHeading,
  settings,
}: BuildSectionSpecificImagePromptOptions) => {
  return `
Create one image for a finished blog post.

Topic: ${keyword}
Image job: ${imageJob}
Section this image supports: ${sectionHeading}

Show a concrete visual that helps explain this exact section. Avoid generic brand scenes, abstract office scenes, and vague product-category metaphors.

Product context:
${buildProductVisualContext(product)}

Style:
${buildImagePlannerStyleGuide(settings)}
`.trim();
};
