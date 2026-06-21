import { buildBlogImagePrompt } from "./buildBlogImagePrompt";
import { buildImagePromptPlans } from "./buildImagePromptPlans";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { StoredProduct } from "./types/StoredProduct";

type BuildImagePromptsOptions = {
  keyword: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
};

export const buildImagePrompts = ({
  keyword,
  product,
  settings,
}: BuildImagePromptsOptions) => {
  return buildImagePromptPlans(settings).map((plan, index) => ({
    alt: index === 0 ? `${keyword} feature image` : `${keyword} image ${index}`,
    prompt: buildBlogImagePrompt({
      imageJob: plan.imageJob,
      keyword,
      product,
      scene: plan.scene,
      settings,
    }),
  }));
};
