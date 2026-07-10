import { runReplicateImagePlannerText } from "../replicate/runReplicateImagePlannerText";
import { buildFallbackBlogImagePromptPlans } from "./buildFallbackBlogImagePromptPlans";
import { buildImagePlannerPrompt } from "./buildImagePlannerPrompt";
import { getImagesPerArticleCount } from "./getImagesPerArticleCount";
import { parseBlogImagePromptPlans } from "./parseBlogImagePromptPlans";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { BlogImagePrompt } from "./types/BlogImagePrompt";
import type { StoredProduct } from "./types/StoredProduct";

type PlanBlogImagePromptsOptions = {
  keyword: string;
  mdx: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  title: string;
};

export const planBlogImagePrompts = async ({
  keyword,
  mdx,
  product,
  settings,
  title,
}: PlanBlogImagePromptsOptions): Promise<BlogImagePrompt[]> => {
  const imageCount = getImagesPerArticleCount(settings.imagesPerArticle);

  if (imageCount === 0 || !process.env.REPLICATE_API_TOKEN) {
    return [];
  }

  const fallbackPlans = buildFallbackBlogImagePromptPlans({
    imageCount,
    keyword,
    mdx,
    product,
    settings,
    title,
  });

  try {
    const text = await runReplicateImagePlannerText({
      prompt: buildImagePlannerPrompt({
        imageCount,
        keyword,
        mdx,
        product,
        settings,
        title,
      }),
      systemPrompt:
        "You are an article image planning editor. Pick useful visual moments from finished articles and return strict JSON only.",
    });
    const plans = parseBlogImagePromptPlans(text);
    const usablePlans =
      plans.length > 0 ? [...plans, ...fallbackPlans] : fallbackPlans;

    return usablePlans
      .slice(0, imageCount)
      .map(({ alt, prompt, sectionHeading }) => ({
        alt,
        prompt,
        sectionHeading,
      }));
  } catch {
    return fallbackPlans
      .slice(0, imageCount)
      .map(({ alt, prompt, sectionHeading }) => ({
        alt,
        prompt,
        sectionHeading,
      }));
  }
};
