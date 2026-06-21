import { buildImagePlannerStyleGuide } from "./buildImagePlannerStyleGuide";
import { buildProductVisualContext } from "./buildProductVisualContext";
import { getImagePlannerArticleText } from "./getImagePlannerArticleText";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { StoredProduct } from "./types/StoredProduct";

type BuildImagePlannerPromptOptions = {
  imageCount: number;
  keyword: string;
  mdx: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  title: string;
};

export const buildImagePlannerPrompt = ({
  imageCount,
  keyword,
  mdx,
  product,
  settings,
  title,
}: BuildImagePlannerPromptOptions) => {
  return `
Review this finished blog article and plan exactly ${imageCount} images for it.

Return JSON only:
{
  "images": [
    {
      "sectionHeading": "heading or article area this image supports",
      "alt": "short useful alt text",
      "prompt": "complete image generation prompt"
    }
  ]
}

Rules:
- The first image must be the feature image for the article as a whole.
- Every other image must support a specific section from the finished article.
- Pick sections where a visual would make the explanation easier, more concrete, or more memorable.
- Do not make generic brand, office, dashboard, abstract, or decorative images unless the section is actually about that.
- Do not mention image placement mechanics. Write prompts for the image model only.
- Include concrete details from the chosen section.
- Keep each prompt visually distinct from the others.
- Use this visual style:
${buildImagePlannerStyleGuide(settings)}

Product context:
${buildProductVisualContext(product)}

Article title: ${title}
Target keyword: ${keyword}

Finished article:
${getImagePlannerArticleText(mdx)}
`.trim();
};
