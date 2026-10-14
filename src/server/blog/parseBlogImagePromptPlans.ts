import { coerceBlogImagePromptPlan } from "./coerceBlogImagePromptPlan";
import { stripMarkdownCodeFence } from "./stripMarkdownCodeFence";
import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";

export const parseBlogImagePromptPlans = (text: string) => {
  const trimmed = stripMarkdownCodeFence(text);
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  const candidate =
    jsonStart >= 0 && jsonEnd > jsonStart
      ? trimmed.slice(jsonStart, jsonEnd + 1)
      : trimmed;

  try {
    const parsed = JSON.parse(candidate) as { images?: unknown };
    const images = Array.isArray(parsed.images) ? parsed.images : [];

    return images
      .map(coerceBlogImagePromptPlan)
      .filter((plan): plan is BlogImagePromptPlan => Boolean(plan));
  } catch {
    return [];
  }
};
