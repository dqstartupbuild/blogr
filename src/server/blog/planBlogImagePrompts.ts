import { runReplicateImagePlannerText } from "../replicate/runReplicateImagePlannerText";
import { buildFallbackBlogImagePromptPlans } from "./buildFallbackBlogImagePromptPlans";
import { buildImagePlannerPrompt } from "./buildImagePlannerPrompt";
import { getImagesPerArticleCount } from "./getImagesPerArticleCount";
import { mergeBlogImagePromptPlans } from "./mergeBlogImagePromptPlans";
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
        assignments: fallbackPlans,
        keyword,
        mdx,
        product,
        settings,
        title,
      }),
      systemPrompt:
        "You are an article image planning editor. Create useful visuals for the assigned article sections and return strict JSON only.",
    });
    const plans = parseBlogImagePromptPlans(text);
    return mergeBlogImagePromptPlans({
      assignments: fallbackPlans,
      plans,
    }).map(({ alt, prompt, sectionHeading, sectionIndex }) => ({
      alt,
      prompt,
      sectionHeading,
      sectionIndex,
    }));
  } catch {
    return fallbackPlans
      .slice(0, imageCount)
      .map(({ alt, prompt, sectionHeading, sectionIndex }) => ({
        alt,
        prompt,
        sectionHeading,
        sectionIndex,
      }));
  }
};
