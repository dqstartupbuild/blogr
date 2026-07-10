import { extractMdxHeadings } from "./extractMdxHeadings";
import { buildSectionSpecificImagePrompt } from "./buildSectionSpecificImagePrompt";
import { selectDistributedMdxHeadings } from "./selectDistributedMdxHeadings";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";
import type { StoredProduct } from "./types/StoredProduct";

type BuildFallbackBlogImagePromptPlansOptions = {
  imageCount: number;
  keyword: string;
  mdx: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  title: string;
};

export const buildFallbackBlogImagePromptPlans = ({
  imageCount,
  keyword,
  mdx,
  product,
  settings,
  title,
}: BuildFallbackBlogImagePromptPlansOptions): BlogImagePromptPlan[] => {
  const headings = extractMdxHeadings(mdx);
  const sectionHeadings = [
    title,
    ...selectDistributedMdxHeadings(headings, imageCount - 1),
  ];

  return sectionHeadings.map((sectionHeading, index) => {
    const imageJob =
      index === 0 ? "Feature image for the article" : "Supporting section image";

    return {
      alt: index === 0 ? `${keyword} feature image` : `${sectionHeading} image`,
      prompt: buildSectionSpecificImagePrompt({
        imageJob,
        keyword,
        product,
        sectionHeading,
        settings,
      }),
      sectionHeading,
    };
  });
};
