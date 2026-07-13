import { buildImagePlannerStyleGuide } from "./buildImagePlannerStyleGuide";
import { buildImagePlannerAssignedContext } from "./buildImagePlannerAssignedContext";
import { buildProductVisualContext } from "./buildProductVisualContext";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";
import type { StoredProduct } from "./types/StoredProduct";

type BuildImagePlannerPromptOptions = {
  assignments: BlogImagePromptPlan[];
  keyword: string;
  mdx: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  title: string;
};

export const buildImagePlannerPrompt = ({
  assignments,
  keyword,
  mdx,
  product,
  settings,
  title,
}: BuildImagePlannerPromptOptions) => {
  return `
Create exactly ${assignments.length} image plans for the assigned article locations below.

Return JSON only:
{
  "images": [
    {
      "sectionHeading": "heading or article area this image supports",
      "sectionIndex": 0,
      "alt": "short useful alt text",
      "prompt": "complete image generation prompt"
    }
  ]
}

Rules:
- The locations are already chosen. Return one image plan for each assigned location in the same order.
- Copy every sectionHeading and sectionIndex exactly. Do not choose, rename, reorder, or skip sections.
- The first assignment is the feature image for the article as a whole and has no sectionIndex.
- Every other image must make its assigned section easier, more concrete, or more memorable.
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

Assigned article locations:
${JSON.stringify(buildImagePlannerAssignedContext(mdx, assignments), null, 2)}
`.trim();
};
